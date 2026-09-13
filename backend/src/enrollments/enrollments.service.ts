import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Enrollment } from '../entities/enrollment.entity'
import { Class } from '../entities/class.entity'
import { Member } from '../entities/member.entity'
import { Notification } from '../entities/notification.entity'
import { PusherService } from '../pusher/pusher.service'

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private pusherService: PusherService,
  ) {}

  async enroll(classId: string, memberId: string) {
    const cls = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['enrollments', 'trainer', 'trainer.user'],
    })
    if (!cls) throw new NotFoundException('Class not found')

    if (cls.enrollments.length >= cls.capacity) {
      throw new BadRequestException('Class is full, no spots available')
    }

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['user'],
    })
    if (!member) throw new NotFoundException('Member not found')

    const existing = await this.enrollmentRepository.findOne({
      where: { class: { id: classId }, member: { id: memberId } },
    })
    if (existing) throw new BadRequestException('Member is already enrolled in this class')

    const enrollment = this.enrollmentRepository.create({ class: cls, member })
    await this.enrollmentRepository.save(enrollment)

    const notification = this.notificationRepository.create({
      user: cls.trainer.user,
      message: `${member.user.name} enrolled in ${cls.title}`,
    })
    await this.notificationRepository.save(notification)

    await this.pusherService.trigger(
      `trainer-${cls.trainer.id}`,
      'new-enrollment',
      {
        className: cls.title,
        memberName: member.user.name,
        enrolledAt: enrollment.enrolled_at,
      },
    )

    return { message: 'Enrolled successfully', enrollment }
  }

  async cancelEnrollment(classId: string, memberId: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { class: { id: classId }, member: { id: memberId } },
    })
    if (!enrollment) throw new NotFoundException('Enrollment not found')

    await this.enrollmentRepository.delete(enrollment.id)
    return { message: 'Enrollment cancelled successfully' }
  }

  async findEnrollmentsByClass(classId: string) {
    const cls = await this.classRepository.findOne({ where: { id: classId } })
    if (!cls) throw new NotFoundException('Class not found')

    return this.enrollmentRepository.find({
      where: { class: { id: classId } },
      relations: ['member', 'member.user'],
      order: { enrolled_at: 'DESC' },
    })
  }

  async findEnrollmentsByMember(memberId: string) {
    return this.enrollmentRepository.find({
      where: { member: { id: memberId } },
      relations: ['class', 'class.trainer', 'class.trainer.user'],
      order: { enrolled_at: 'DESC' },
    })
  }
}