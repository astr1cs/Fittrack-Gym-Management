import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnrollmentsController } from './enrollments.controller'
import { EnrollmentsService } from './enrollments.service'
import { Enrollment } from '../entities/enrollment.entity'
import { Class } from '../entities/class.entity'
import { Member } from '../entities/member.entity'
import { Notification } from '../entities/notification.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Class, Member, Notification]),
    AuthModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}