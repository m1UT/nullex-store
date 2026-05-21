import * as path from 'path'
import * as fs from 'fs'
import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, ParseIntPipe, UseGuards, HttpCode,
  UseInterceptors, UploadedFile, BadRequestException, Res,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Response } from 'express'
import { AdminGuard } from './admin.guard'
import { AdminService } from './admin.service'
import { ReportsService, ReportFormat, ReportType } from './reports.service'
import { Category, OrderStatus } from '@prisma/client'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly reports: ReportsService,
  ) {}

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

  @Get('charts')
  getChartData() {
    return this.admin.getChartData()
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

  @Get('reports/:type')
  async getReport(
    @Param('type') type: string,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    const validTypes: ReportType[]   = ['sales', 'products', 'users']
    const validFormats: ReportFormat[] = ['excel', 'pdf', 'word']
    const rType   = validTypes.includes(type as ReportType)     ? (type   as ReportType)   : 'sales'
    const rFormat = validFormats.includes(format as ReportFormat) ? (format as ReportFormat) : 'excel'

    const result = await this.reports.generate(rType, rFormat)
    res.set({
      'Content-Type':        result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
      'Content-Length':      result.buffer.length,
    })
    res.send(result.buffer)
  }

  @Get('banners')
  getBanners() {
    return this.admin.getBanners()
  }

  @Post('banners')
  createBanner(@Body() body: { imageUrl: string; action: string; actionValue?: string; position: number; active: boolean }) {
    return this.admin.createBanner(body)
  }

  @Put('banners/:id')
  updateBanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { imageUrl?: string; action?: string; actionValue?: string | null; position?: number; active?: boolean },
  ) {
    return this.admin.updateBanner(id, body)
  }

  @Delete('banners/:id')
  @HttpCode(204)
  deleteBanner(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteBanner(id)
  }
}
