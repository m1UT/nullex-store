import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, ParseIntPipe, UseGuards, HttpCode,
} from '@nestjs/common'
import { AdminGuard } from './admin.guard'
import { AdminService } from './admin.service'
import { Category, OrderStatus } from '@prisma/client'

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  getStats() {
    return this.admin.getStats()
  }

  @Get('products')
  getProducts() {
    return this.admin.getProducts()
  }

  @Post('products')
  createProduct(@Body() body: {
    name: string
    description?: string
    category: Category
    price: number
    stock: number
  }) {
    return this.admin.createProduct(body)
  }

  @Put('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      name?: string
      description?: string
      category?: Category
      price?: number
      stock?: number
    },
  ) {
    return this.admin.updateProduct(id, body)
  }

  @Delete('products/:id')
  @HttpCode(204)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProduct(id)
  }

  @Get('orders')
  getOrders() {
    return this.admin.getOrders()
  }

  @Patch('orders/:id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: OrderStatus },
  ) {
    return this.admin.updateOrderStatus(id, body.status)
  }

  @Get('users')
  getUsers() {
    return this.admin.getUsers()
  }
}
