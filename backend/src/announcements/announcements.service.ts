import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Announcement } from '../entities/announcement.entity'
import { User, UserRole } from '../entities/user.entity'
import { Notification } from '../entities/notification.entity'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { PusherService } from '../pusher/pusher.service'

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private pusherService: PusherService,
  ) {}

  async create(dto: CreateAnnouncementDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    const announcement = this.announcementRepository.create({
      title: dto.title,
      content: dto.content,
      created_by: user,
    })

    await this.announcementRepository.save(announcement)

    const recipients = await this.userRepository.find({
      where: { role: In([UserRole.MEMBER, UserRole.TRAINER]) },
    })

    const notifications = recipients.map((recipient) =>
      this.notificationRepository.create({
        user: recipient,
        message: `New announcement: ${announcement.title}`,
      }),
    )
    await this.notificationRepository.save(notifications)

    await this.pusherService.trigger('announcements', 'new-announcement', {
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.created_at,
    })

    return announcement
  }

  async findAll() {
    return this.announcementRepository.find({
      relations: ['created_by'],
      order: { created_at: 'DESC' },
    })
  }

  async findOne(id: string) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['created_by'],
    })
    if (!announcement) throw new NotFoundException('Announcement not found')
    return announcement
  }

  async remove(id: string) {
    const announcement = await this.announcementRepository.findOne({ where: { id } })
    if (!announcement) throw new NotFoundException('Announcement not found')

    await this.announcementRepository.delete(id)
    return { message: 'Announcement deleted successfully' }
  }
}