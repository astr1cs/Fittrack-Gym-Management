import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrainersController } from './trainers.controller'
import { TrainersService } from './trainers.service'
import { Trainer } from '../entities/trainer.entity'
import { User } from '../entities/user.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Trainer, User]),
    AuthModule,
  ],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TrainersService],
})
export class TrainersModule {}