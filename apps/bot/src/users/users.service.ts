import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { User } from '@nullex/shared'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(telegramId: bigint, username?: string): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { telegramId } })
    if (existing) return existing as User

    return this.prisma.user.create({
      data: { telegramId, username },
    }) as Promise<User>
  }

  async findByTelegramId(telegramId: bigint): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { telegramId } }) as Promise<User | null>
  }
}
