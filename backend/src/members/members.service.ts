import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'
import { User } from '../entities/user.entity'
import { UpdateMemberDto } from './dto/update-member.dto'

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
async findByUserId(userId: string) {
  const member = await this.memberRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user', 'memberships', 'memberships.plan'],
  })
  if (!member) throw new NotFoundException('Member record not found')
  return member
}
  async findAll() {
    return this.memberRepository.find({
      relations: ['user'],
      order: { joined_at: 'DESC' },
    })
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['user', 'memberships', 'memberships.plan'],
    })
    if (!member) throw new NotFoundException('Member not found')
    return member
  }

  async update(id: string, dto: UpdateMemberDto) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!member) throw new NotFoundException('Member not found')

    if (dto.phone) member.phone = dto.phone
    if (dto.date_of_birth) member.date_of_birth = new Date(dto.date_of_birth)
    await this.memberRepository.save(member)

    if (dto.name) {
      member.user.name = dto.name
      await this.userRepository.save(member.user)
    }

    return this.findOne(id)
  }

  async remove(id: string) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!member) throw new NotFoundException('Member not found')

    const userId = member.user.id
    await this.memberRepository.delete(id)
    await this.userRepository.delete(userId)

    return { message: 'Member deleted successfully' }
  }
}