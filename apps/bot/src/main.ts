import 'dotenv/config'
import 'reflect-metadata'

// JSON.stringify doesn't support BigInt by default
;(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
  return this.toString()
}
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000)
  console.log(`Bot server running on port ${process.env.PORT ?? 3000}`)
}

bootstrap()
