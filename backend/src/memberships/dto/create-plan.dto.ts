import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Min(1)
  duration_days: number

  @IsNumber()
  @Min(0)
  price: number
}