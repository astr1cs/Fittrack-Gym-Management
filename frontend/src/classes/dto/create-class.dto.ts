import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'

export class CreateClassDto {
  @IsString()
  @MinLength(3)
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsNotEmpty()
  trainer_id: string

  @IsDateString()
  @IsNotEmpty()
  schedule: string

  @IsNumber()
  @Min(1)
  capacity: number
}