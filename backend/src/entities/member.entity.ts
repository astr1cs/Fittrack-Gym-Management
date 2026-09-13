import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { MemberMembership } from './member-membership.entity'
import { Enrollment } from './enrollment.entity'

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, (user) => user.member)
  @JoinColumn()
  user: User

  @Column()
  phone: string

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date

  @CreateDateColumn()
  joined_at: Date

  @OneToMany(() => MemberMembership, (mm) => mm.member)
  memberships: MemberMembership[]

  @OneToMany(() => Enrollment, (enrollment) => enrollment.member)
  enrollments: Enrollment[]
}