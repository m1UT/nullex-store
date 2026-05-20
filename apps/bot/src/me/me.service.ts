import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MeService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async getOrCreate(telegramId: bigint, username?: string) {
    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: { username: username ?? undefined },
      create: { telegramId, username },
    })
    return { ...user, telegramId: user.telegramId.toString() }
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

  async placeOrder(userId: number, telegramId: string) {
    const orders = await this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      })
      if (cartItems.length === 0) return []

      const totalCost = cartItems.reduce((sum, item) => sum + Number(item.product.price), 0)
      const user = await tx.user.findUnique({ where: { id: userId } })

      if (!user || Number(user.balance) < totalCost) {
        throw new HttpException('Insufficient balance', HttpStatus.PAYMENT_REQUIRED)
      }

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalCost } },
      })

      const orders = []
      for (const cartItem of cartItems) {
        const order = await tx.order.create({
          data: {
            userId,
            total: cartItem.product.price,
            status: 'DELIVERED',
            items: {
              create: [{ productId: cartItem.productId, price: cartItem.product.price }],
            },
          },
          include: { items: { include: { product: true } } },
        })
        orders.push(order)
      }

      await tx.cartItem.deleteMany({ where: { userId } })
      return orders
    })

    // Send Telegram notifications outside transaction (best-effort)
    for (const order of orders) {
      const code = `ITEM-${String(order.items[0].id).padStart(6, '0')}`
      try {
        await this.bot.telegram.sendMessage(
          telegramId,
          `✅ *${order.items[0].product.name}* — $${Number(order.total).toFixed(2)}\n\n🔑 Код активации:\n\`${code}\``,
          { parse_mode: 'Markdown' },
        )
      } catch { /* user may not have started the bot */ }
    }

    return orders
  }
}
