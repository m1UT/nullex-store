import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { Order } from '@nullex/shared'

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    }) as Promise<Order[]>
  }

  async createOrder(userId: number, productIds: number[]): Promise<Order> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const total = products.reduce(
      (sum, p) => sum + Number(p.price),
      0,
    )

    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: p.price,
          })),
        },
      },
      include: { items: true },
    }) as Promise<Order>
  }
}
