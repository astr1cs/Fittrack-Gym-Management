import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Member } from './member.entity'
import { MembershipPlan } from './membership-plan.entity'

export enum MembershipStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('member_memberships')
export class MemberMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Member, (member) => member.memberships)
  @JoinColumn()
  member: Member

  @ManyToOne(() => MembershipPlan, (plan) => plan.memberships)
  @JoinColumn()
  plan: MembershipPlan

  @Column({ type: 'date' })
  start_date: Date

  @Column({ type: 'date' })
  end_date: Date

  @Column({ type: 'enum', enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  status: MembershipStatus
}