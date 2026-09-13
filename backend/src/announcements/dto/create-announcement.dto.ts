import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @MinLength(10)
  content: string
}