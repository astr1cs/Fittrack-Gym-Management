import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../entities/notification.entity'
import { User } from '../entities/user.entity'
import { CreateNotificationDto } from './dto/create-notification.dto'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.user_id } })
    if (!user) throw new NotFoundException('User not found')

    const notification = this.notificationRepository.create({
      user,
      message: dto.message,
    })

    await this.notificationRepository.save(notification)
    return notification
  }

  async findAllForUser(userId: string) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    })
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    })
    if (!notification) throw new NotFoundException('Notification not found')

    notification.is_read = true
    await this.notificationRepository.save(notification)
    return notification
  }

async markAllAsRead(userId: string) {
  await this.notificationRepository
    .createQueryBuilder()
    .update(Notification)
    .set({ is_read: true })
    .where('"userId" = :userId', { userId })
    .execute()

  return { message: 'All notifications marked as read' }
}

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: { user: { id: userId }, is_read: false },
    })
    return { unread_count: count }
  }
}