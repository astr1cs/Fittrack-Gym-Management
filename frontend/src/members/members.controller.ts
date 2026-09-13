import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { MembersService } from './members.service'
import { UpdateMemberDto } from './dto/update-member.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.membersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.membersService.remove(id)
  }
}