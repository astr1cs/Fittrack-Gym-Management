import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassesController } from './classes.controller'
import { ClassesService } from './classes.service'
import { Class } from '../entities/class.entity'
import { Trainer } from '../entities/trainer.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Trainer]),
    AuthModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}