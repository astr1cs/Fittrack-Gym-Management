import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ClassesService } from './classes.service'
import { CreateClassDto } from './dto/create-class.dto'
import { UpdateClassDto } from './dto/update-class.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto)
  }

  @Get()
  findAll() {
    return this.classesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id)
  }
}