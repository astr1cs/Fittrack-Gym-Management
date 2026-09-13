import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { TrainersService } from './trainers.service'
import { CreateTrainerDto } from './dto/create-trainer.dto'
import { UpdateTrainerDto } from './dto/update-trainer.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'

@Controller('trainers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainersController {
  constructor(private trainersService: TrainersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTrainerDto) {
    return this.trainersService.create(dto)
  }

  @Get()
  findAll() {
    return this.trainersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTrainerDto) {
    return this.trainersService.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id)
  }
}