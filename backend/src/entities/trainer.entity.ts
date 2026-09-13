import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Class } from './class.entity'

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, (user) => user.trainer)
  @JoinColumn()
  user: User

  @Column()
  specialization: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Class, (cls) => cls.trainer)
  classes: Class[]
}