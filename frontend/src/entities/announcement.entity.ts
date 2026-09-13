import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @ManyToOne(() => User)
  @JoinColumn()
  created_by: User

  @CreateDateColumn()
  created_at: Date
}