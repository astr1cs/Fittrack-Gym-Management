import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../entities/user.entity'
import { Member } from '../entities/member.entity'
import { Trainer } from '../entities/trainer.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } })
    if (existing) throw new BadRequestException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role ?? UserRole.MEMBER,
    })
    await this.userRepository.save(user)

    if (user.role === UserRole.MEMBER) {
      const member = this.memberRepository.create({ user, phone: '' })
      await this.memberRepository.save(member)
    }

    if (user.role === UserRole.TRAINER) {
      const trainer = this.trainerRepository.create({ user, specialization: '' })
      await this.trainerRepository.save(trainer)
    }

    return { message: 'Registration successful' }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const match = await bcrypt.compare(dto.password, user.password)
    if (!match) throw new UnauthorizedException('Invalid credentials')

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'created_at'],
    })
    if (!user) throw new UnauthorizedException()
    return user
  }
}