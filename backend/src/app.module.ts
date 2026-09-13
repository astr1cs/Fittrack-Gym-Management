import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { MembersModule } from './members/members.module'
import { TrainersModule } from './trainers/trainers.module'
import { MembershipsModule } from './memberships/memberships.module'
import { ClassesModule } from './classes/classes.module'
import { EnrollmentsModule } from './enrollments/enrollments.module'
import { AnnouncementsModule } from './announcements/announcements.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PusherModule } from './pusher/pusher.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT')!),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PusherModule,
    AuthModule,
    MembersModule,
    TrainersModule,
    MembershipsModule,
    ClassesModule,
    EnrollmentsModule,
    AnnouncementsModule,
    NotificationsModule,
  ],
})
export class AppModule {}