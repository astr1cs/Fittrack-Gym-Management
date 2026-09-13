import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MembershipsController } from './memberships.controller'
import { MembershipsService } from './memberships.service'
import { MembershipPlan } from '../entities/membership-plan.entity'
import { MemberMembership } from '../entities/member-membership.entity'
import { Member } from '../entities/member.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPlan, MemberMembership, Member]),
    AuthModule,
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}