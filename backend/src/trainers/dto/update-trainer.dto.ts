import { IsOptional, IsString } from 'class-validator'

export class UpdateTrainerDto {
  @IsString()
  @IsOptional()
  specialization?: string

  @IsString()
  @IsOptional()
  bio?: string
}