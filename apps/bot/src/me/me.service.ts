import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(telegramId: bigint, username?: string) {
    return this.prisma.user.upsert({
      where: { telegramId },
      update: { username: username ?? undefined },
      create: { telegramId, username },
    })
  }

  async getLikedProducts(userId: number) {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      include: { product: true },
    })
    return likes.map((l) => l.product)
  }

  async toggleLike(userId: number, productId: number) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) {
      await this.prisma.like.delete({ where: { userId_productId: { userId, productId } } })
      return { liked: false }
    }
    await this.prisma.like.create({ data: { userId, productId } })
    return { liked: true }
  }

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })
  }

  async addToCart(userId: number, productId: number) {
    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    })
  }

  async removeFromCart(userId: number, productId: number) {
    return this.prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    }).catch(() => null)
  }

  async clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({ where: { userId } })
  }

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async placeOrder(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })
    if (cartItems.length === 0) return { error: 'Cart is empty' }
    const total = cartItems.reduce((sum, item) => sum + Number(item.product.price), 0)
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PAID',
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })
    await this.prisma.cartItem.deleteMany({ where: { userId } })
    return order
  }
}
