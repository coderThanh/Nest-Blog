import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { softDeleteExtension } from './extensions/soft-delete.extension';

@Injectable()
// extends PrismaClient
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // 1. Giữ instance gốc ở dạng private để quản lý kết nối nội bộ
  private readonly prismaClient: PrismaClient;

  // 2. Định nghĩa client public chứa Extension để các Service khác gọi vào
  readonly client: ReturnType<typeof this.initClient>;

  constructor(configService: ConfigService) {
    const connectString = new ConfigUltils(configService).getDataBaseURL();

    if (!connectString) throw new Error('DATABASE_URL is not set');

    const pool = new pg.Pool({ connectionString: connectString });
    const adapter = new PrismaPg(pool);

    // Khởi tạo client gốc với pg adapter
    this.prismaClient = new PrismaClient({ adapter });

    // Khởi tạo client mở rộng kèm extension
    this.client = this.initClient();
  }

  /**
   * Tích hợp các extension vào Prisma Client
   */
  private initClient() {
    return this.prismaClient.$extends(softDeleteExtension);
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }
  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
