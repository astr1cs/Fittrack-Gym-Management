import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateMemberDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsDateString()
  @IsOptional()
  date_of_birth?: string
}