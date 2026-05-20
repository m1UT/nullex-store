import { Module } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'
import { BotModule } from './bot/bot.module'
import { ProductsModule } from './products/products.module'
import { UsersModule } from './users/users.module'
import { OrdersModule } from './orders/orders.module'
import { PrismaModule } from './prisma/prisma.module'
import { AdminModule } from './admin/admin.module'
import { MeModule } from './me/me.module'
// import { RedisModule } from './redis/redis.module' // temporarily disabled

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN ?? '',
    }),
    PrismaModule,
    // RedisModule, // temporarily disabled
    BotModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    AdminModule,
    MeModule,
  ],
})
export class AppModule {}
