import * as path from 'path'
import * as fs from 'fs'
import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, ParseIntPipe, UseGuards, HttpCode,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { AdminGuard } from './admin.guard'
import { AdminService } from './admin.service'
import { Category, OrderStatus } from '@prisma/client'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
        cb(null, UPLOADS_DIR)
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true)
      else cb(new BadRequestException('Only image files allowed'), false)
    },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded')
    return { url: `/uploads/${file.filename}` }
  }

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

  @Patch('users/:id/balance')
  adjustBalance(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ) {
    return this.admin.adjustBalance(id, body.amount)
  }

  @Post('users/:id/message')
  @HttpCode(200)
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { text: string },
  ) {
    return this.admin.sendMessageToUser(id, body.text)
  }

  @Post('broadcast')
  @HttpCode(200)
  broadcast(@Body() body: { text: string }) {
    return this.admin.broadcast(body.text)
  }
}
