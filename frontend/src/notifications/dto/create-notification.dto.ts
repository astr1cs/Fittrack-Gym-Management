import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @IsNotEmpty()
  message: string
}