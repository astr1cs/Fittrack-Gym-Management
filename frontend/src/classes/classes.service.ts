import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from '../entities/class.entity'
import { Trainer } from '../entities/trainer.entity'
import { CreateClassDto } from './dto/create-class.dto'
import { UpdateClassDto } from './dto/update-class.dto'

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
  ) {}

  async create(dto: CreateClassDto) {
    const trainer = await this.trainerRepository.findOne({
      where: { id: dto.trainer_id },
      relations: ['user'],
    })
    if (!trainer) throw new NotFoundException('Trainer not found')

    const cls = this.classRepository.create({
      title: dto.title,
      description: dto.description ?? '',
      trainer,
      schedule: new Date(dto.schedule),
      capacity: dto.capacity,
    })

    await this.classRepository.save(cls)
    return cls
  }

  async findAll() {
    const classes = await this.classRepository.find({
      relations: ['trainer', 'trainer.user', 'enrollments'],
      order: { schedule: 'ASC' },
    })

    return classes.map((cls) => ({
      ...cls,
      enrollment_count: cls.enrollments.length,
      spots_left: cls.capacity - cls.enrollments.length,
    }))
  }

  async findOne(id: string) {
    const cls = await this.classRepository.findOne({
      where: { id },
      relations: ['trainer', 'trainer.user', 'enrollments', 'enrollments.member', 'enrollments.member.user'],
    })
    if (!cls) throw new NotFoundException('Class not found')

    return {
      ...cls,
      enrollment_count: cls.enrollments.length,
      spots_left: cls.capacity - cls.enrollments.length,
    }
  }

  async update(id: string, dto: UpdateClassDto) {
    const cls = await this.classRepository.findOne({ where: { id } })
    if (!cls) throw new NotFoundException('Class not found')

    if (dto.title) cls.title = dto.title
    if (dto.description) cls.description = dto.description
    if (dto.schedule) cls.schedule = new Date(dto.schedule)
    if (dto.capacity) cls.capacity = dto.capacity

    if (dto.trainer_id) {
      const trainer = await this.trainerRepository.findOne({ where: { id: dto.trainer_id } })
      if (!trainer) throw new NotFoundException('Trainer not found')
      cls.trainer = trainer
    }

    await this.classRepository.save(cls)
    return this.findOne(id)
  }

  async remove(id: string) {
    const cls = await this.classRepository.findOne({ where: { id } })
    if (!cls) throw new NotFoundException('Class not found')

    await this.classRepository.delete(id)
    return { message: 'Class deleted successfully' }
  }
}