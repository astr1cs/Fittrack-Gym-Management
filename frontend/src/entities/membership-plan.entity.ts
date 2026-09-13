import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { MemberMembership } from './member-membership.entity'

@Entity('membership_plans')
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  duration_days: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => MemberMembership, (mm) => mm.plan)
  memberships: MemberMembership[]
}