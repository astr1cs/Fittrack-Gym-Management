import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AnnouncementsService } from './announcements.service'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'
import { Request } from 'express'

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateAnnouncementDto, @Req() req: Request & { user: any }) {
    return this.announcementsService.create(dto, req.user.id)
  }

  @Get()
  findAll() {
    return this.announcementsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id)
  }
}