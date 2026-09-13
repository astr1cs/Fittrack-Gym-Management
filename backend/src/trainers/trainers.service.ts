import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Trainer } from '../entities/trainer.entity'
import { User, UserRole } from '../entities/user.entity'
import { CreateTrainerDto } from './dto/create-trainer.dto'
import { UpdateTrainerDto } from './dto/update-trainer.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
async findByUserId(userId: string) {
  const trainer = await this.trainerRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user', 'classes'],
  })
  if (!trainer) throw new NotFoundException('Trainer record not found')
  return trainer
}
  async create(dto: CreateTrainerDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } })
    if (existing) throw new BadRequestException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, 10)

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: UserRole.TRAINER,
    })
    await this.userRepository.save(user)

    const trainer = this.trainerRepository.create({
      user,
      specialization: dto.specialization,
      bio: dto.bio ?? '',
    })
    await this.trainerRepository.save(trainer)

    return { message: 'Trainer created successfully', trainer }
  }

  async findAll() {
    return this.trainerRepository.find({
      relations: ['user', 'classes'],
      order: { created_at: 'DESC' },
    })
  }

  async findOne(id: string) {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: ['user', 'classes'],
    })
    if (!trainer) throw new NotFoundException('Trainer not found')
    return trainer
  }

  async update(id: string, dto: UpdateTrainerDto) {
    const trainer = await this.trainerRepository.findOne({ where: { id } })
    if (!trainer) throw new NotFoundException('Trainer not found')

    if (dto.specialization) trainer.specialization = dto.specialization
    if (dto.bio) trainer.bio = dto.bio

    await this.trainerRepository.save(trainer)
    return this.findOne(id)
  }

  async remove(id: string) {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!trainer) throw new NotFoundException('Trainer not found')

    const userId = trainer.user.id
    await this.trainerRepository.delete(id)
    await this.userRepository.delete(userId)

    return { message: 'Trainer deleted successfully' }
  }
}