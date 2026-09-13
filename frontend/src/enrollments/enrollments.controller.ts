import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { EnrollDto } from './dto/enroll.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post(':classId/enroll')
  enroll(@Param('classId') classId: string, @Body() dto: EnrollDto) {
    return this.enrollmentsService.enroll(classId, dto.member_id)
  }

  @Delete(':classId/enroll')
  cancelEnrollment(@Param('classId') classId: string, @Body() dto: EnrollDto) {
    return this.enrollmentsService.cancelEnrollment(classId, dto.member_id)
  }

  @Get(':classId/enrollments')
  @Roles(UserRole.ADMIN)
  findEnrollmentsByClass(@Param('classId') classId: string) {
    return this.enrollmentsService.findEnrollmentsByClass(classId)
  }

  @Get('member/:memberId')
  findEnrollmentsByMember(@Param('memberId') memberId: string) {
    return this.enrollmentsService.findEnrollmentsByMember(memberId)
  }
}