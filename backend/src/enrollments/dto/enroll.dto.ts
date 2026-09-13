import { IsNotEmpty, IsUUID } from 'class-validator'

export class EnrollDto {
  @IsUUID()
  @IsNotEmpty()
  member_id: string
}