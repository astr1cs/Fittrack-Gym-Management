import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnrollmentsController } from './enrollments.controller'
import { EnrollmentsService } from './enrollments.service'
import { Enrollment } from '../entities/enrollment.entity'
import { Class } from '../entities/class.entity'
import { Member } from '../entities/member.entity'
import { Notification as NotificationEntity } from '../entities/notification.entity'
import { AuthModule } from '../auth/auth.module'
import { PusherModule } from '../pusher/pusher.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Class, Member, NotificationEntity]),
    AuthModule,
    PusherModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}