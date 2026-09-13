import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from '../../entities/user.entity'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}