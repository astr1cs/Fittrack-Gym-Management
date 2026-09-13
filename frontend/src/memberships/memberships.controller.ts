import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { MembershipsService } from './memberships.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { AssignMembershipDto } from './dto/assign-membership.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UserRole } from '../entities/user.entity'

@Controller('memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Post('plans')
  @Roles(UserRole.ADMIN)
  createPlan(@Body() dto: CreatePlanDto) {
    return this.membershipsService.createPlan(dto)
  }

  @Get('plans')
  findAllPlans() {
    return this.membershipsService.findAllPlans()
  }

  @Post('assign')
  @Roles(UserRole.ADMIN)
  assign(@Body() dto: AssignMembershipDto) {
    return this.membershipsService.assignMembership(dto)
  }

  @Get(':memberId')
  findMemberMemberships(@Param('memberId') memberId: string) {
    return this.membershipsService.findMemberMemberships(memberId)
  }
}