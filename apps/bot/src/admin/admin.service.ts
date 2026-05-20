import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { PrismaService } from '../prisma/prisma.service'
import { Category, OrderStatus } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async getStats() {
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: [OrderStatus.PAID, OrderStatus.DELIVERED] } },
      }),
    ])
    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(revenueResult._sum.total ?? 0),
    }
  }

  getProducts() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  }

  createProduct(data: {
    name: string
    description?: string
    category: Category
    price: number
    stock: number
  }) {
    return this.prisma.product.create({ data })
  }

  updateProduct(
    id: number,
    data: {
      name?: string
      description?: string
      category?: Category
      price?: number
      stock?: number
    },
  ) {
    return this.prisma.product.update({ where: { id }, data })
  }

  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } })
  }

  async getOrders() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true, telegramId: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    })
    return orders.map((o) => ({
      ...o,
      user: { ...o.user, telegramId: o.user.telegramId.toString() },
    }))
  }

  updateOrderStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({ where: { id }, data: { status } })
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        telegramId: true,
        username: true,
        balance: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    })
    return users.map((u) => ({ ...u, telegramId: u.telegramId.toString() }))
  }

  async adjustBalance(userId: number, amount: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
      select: { id: true, balance: true },
    })
    return { ...user, balance: user.balance.toString() }
  }

  async sendMessageToUser(userId: number, text: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { ok: false }
    try {
      await this.bot.telegram.sendMessage(user.telegramId.toString(), text)
      return { ok: true }
    } catch { return { ok: false } }
  }

  async broadcast(text: string) {
    const users = await this.prisma.user.findMany({ select: { telegramId: true } })
    let sent = 0
    for (const u of users) {
      try {
        await this.bot.telegram.sendMessage(u.telegramId.toString(), text)
        sent++
      } catch { /* user blocked bot or never started it */ }
    }
    return { sent, total: users.length }
  }

  getBanners() {
    return this.prisma.banner.findMany({ orderBy: { position: 'asc' } })
  }

  createBanner(data: { imageUrl: string; action: string; actionValue?: string; position: number; active: boolean }) {
    return this.prisma.banner.create({ data })
  }

  updateBanner(id: number, data: { imageUrl?: string; action?: string; actionValue?: string | null; position?: number; active?: boolean }) {
    return this.prisma.banner.update({ where: { id }, data })
  }

  deleteBanner(id: number) {
    return this.prisma.banner.delete({ where: { id } })
  }
}
