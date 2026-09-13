import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Class } from './class.entity'
import { Member } from './member.entity'

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Class, (cls) => cls.enrollments)
  @JoinColumn()
  class: Class

  @ManyToOne(() => Member, (member) => member.enrollments)
  @JoinColumn()
  member: Member

  @CreateDateColumn()
  enrolled_at: Date
}