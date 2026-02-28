import { Module } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'
import { BotModule } from './bot/bot.module'
import { ProductsModule } from './products/products.module'
import { UsersModule } from './users/users.module'
import { OrdersModule } from './orders/orders.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN ?? '',
    }),
    PrismaModule,
    RedisModule,
    BotModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
