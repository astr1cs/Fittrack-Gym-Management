import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Trainer } from './trainer.entity'
import { Enrollment } from './enrollment.entity'

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @ManyToOne(() => Trainer, (trainer) => trainer.classes)
  @JoinColumn()
  trainer: Trainer

  @Column({ type: 'timestamp' })
  schedule: Date

  @Column()
  capacity: number

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[]
}