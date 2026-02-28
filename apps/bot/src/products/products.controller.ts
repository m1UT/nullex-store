import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ProductsService } from './products.service'
import type { Product } from '@nullex/shared'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productsService.findOne(id)
  }
}
