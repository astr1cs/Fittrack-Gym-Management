import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnnouncementsController } from './announcements.controller'
import { AnnouncementsService } from './announcements.service'
import { Announcement } from '../entities/announcement.entity'
import { User } from '../entities/user.entity'
import { Notification } from '../entities/notification.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, User, Notification]),
    AuthModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}