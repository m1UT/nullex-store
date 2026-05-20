import 'dotenv/config'
import 'reflect-metadata'

// JSON.stringify doesn't support BigInt by default
;(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
  return this.toString()
}
import * as path from 'path'
import * as fs from 'fs'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const uploadsDir = path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' })

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Bot server running on port ${process.env.PORT ?? 3000}`)
}

bootstrap()
