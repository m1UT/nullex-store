import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { ReportsService } from './reports.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService, ReportsService],
})
export class AdminModule {}
