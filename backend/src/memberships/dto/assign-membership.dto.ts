import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator'

export class AssignMembershipDto {
  @IsUUID()
  @IsNotEmpty()
  member_id: string

  @IsUUID()
  @IsNotEmpty()
  plan_id: string

  @IsDateString()
  @IsNotEmpty()
  start_date: string
}