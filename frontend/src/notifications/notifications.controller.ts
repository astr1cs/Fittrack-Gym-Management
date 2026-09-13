import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'
import { Request } from 'express'

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto)
  }

  @Get()
  findAll(@Req() req: Request & { user: any }) {
    return this.notificationsService.findAllForUser(req.user.id)
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: Request & { user: any }) {
    return this.notificationsService.getUnreadCount(req.user.id)
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: Request & { user: any }) {
    return this.notificationsService.markAsRead(id, req.user.id)
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: Request & { user: any }) {
    return this.notificationsService.markAllAsRead(req.user.id)
  }
}