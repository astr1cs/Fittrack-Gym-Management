import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Member } from './member.entity'
import { Trainer } from './trainer.entity'

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  TRAINER = 'trainer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole

  @CreateDateColumn()
  created_at: Date

  @OneToOne(() => Member, (member) => member.user)
  member: Member

  @OneToOne(() => Trainer, (trainer) => trainer.user)
  trainer: Trainer
}