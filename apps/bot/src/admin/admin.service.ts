import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Category, OrderStatus } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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

  getOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true, telegramId: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    })
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
}
