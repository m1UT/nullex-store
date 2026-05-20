import {
  Controller, Get, Post, Delete,
  Param, ParseIntPipe, UseGuards, Req, HttpCode,
} from '@nestjs/common'
import { TmaGuard } from '../tma/tma.guard'
import { MeService } from './me.service'

@Controller('me')
@UseGuards(TmaGuard)
export class MeController {
  constructor(private readonly me: MeService) {}

  private async resolveUser(req: any) {
    const { id, username } = req.tgUser
    return this.me.getOrCreate(BigInt(id), username)
  }

  @Get()
  async getMe(@Req() req: any) {
    return this.resolveUser(req)
  }

  @Get('photo')
  async getPhoto(@Req() req: any) {
    const url = await this.me.getPhotoUrl(String(req.tgUser.id))
    return { url }
  }

  @Get('likes')
  async getLikes(@Req() req: any) {
    const u = await this.resolveUser(req)
    return this.me.getLikedProducts(u.id)
  }

  @Post('likes/:productId')
  async toggleLike(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    const u = await this.resolveUser(req)
    return this.me.toggleLike(u.id, productId)
  }

  @Get('cart')
  async getCart(@Req() req: any) {
    const u = await this.resolveUser(req)
    return this.me.getCart(u.id)
  }

  @Post('cart/:productId')
  async addToCart(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    const u = await this.resolveUser(req)
    return this.me.addToCart(u.id, productId)
  }

  @Delete('cart/:productId')
  @HttpCode(204)
  async removeFromCart(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    const u = await this.resolveUser(req)
    await this.me.removeFromCart(u.id, productId)
  }

  @Delete('cart')
  @HttpCode(204)
  async clearCart(@Req() req: any) {
    const u = await this.resolveUser(req)
    await this.me.clearCart(u.id)
  }

  @Get('orders')
  async getOrders(@Req() req: any) {
    const u = await this.resolveUser(req)
    return this.me.getOrders(u.id)
  }

  @Post('orders')
  @HttpCode(201)
  async placeOrder(@Req() req: any) {
    const u = await this.resolveUser(req)
    return this.me.placeOrder(u.id, String(req.tgUser.id))
  }
}
