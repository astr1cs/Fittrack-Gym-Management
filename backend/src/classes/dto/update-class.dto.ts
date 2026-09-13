import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'

export class UpdateClassDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsOptional()
  trainer_id?: string

  @IsDateString()
  @IsOptional()
  schedule?: string

  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number
}