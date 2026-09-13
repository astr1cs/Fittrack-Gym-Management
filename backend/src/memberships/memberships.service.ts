import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MembershipPlan } from '../entities/membership-plan.entity'
import { MemberMembership, MembershipStatus } from '../entities/member-membership.entity'
import { Member } from '../entities/member.entity'
import { CreatePlanDto } from './dto/create-plan.dto'
import { AssignMembershipDto } from './dto/assign-membership.dto'

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(MembershipPlan)
    private planRepository: Repository<MembershipPlan>,
    @InjectRepository(MemberMembership)
    private memberMembershipRepository: Repository<MemberMembership>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async createPlan(dto: CreatePlanDto) {
    const plan = this.planRepository.create({
      name: dto.name,
      duration_days: dto.duration_days,
      price: dto.price,
    })
    await this.planRepository.save(plan)
    return plan
  }

  async findAllPlans() {
    return this.planRepository.find({
      order: { created_at: 'ASC' },
    })
  }

  async assignMembership(dto: AssignMembershipDto) {
    const member = await this.memberRepository.findOne({
      where: { id: dto.member_id },
    })
    if (!member) throw new NotFoundException('Member not found')

    const plan = await this.planRepository.findOne({
      where: { id: dto.plan_id },
    })
    if (!plan) throw new NotFoundException('Plan not found')

    const startDate = new Date(dto.start_date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + plan.duration_days)

    const membership = this.memberMembershipRepository.create({
      member,
      plan,
      start_date: startDate,
      end_date: endDate,
      status: MembershipStatus.ACTIVE,
    })

    await this.memberMembershipRepository.save(membership)
    return membership
  }

  async findMemberMemberships(memberId: string) {
    return this.memberMembershipRepository.find({
      where: { member: { id: memberId } },
      relations: ['plan'],
      order: { start_date: 'DESC' },
    })
  }
}