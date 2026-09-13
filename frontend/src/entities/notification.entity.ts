import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  @JoinColumn()
  user: User

  @Column()
  message: string

  @Column({ default: false })
  is_read: boolean

  @CreateDateColumn()
  created_at: Date
}