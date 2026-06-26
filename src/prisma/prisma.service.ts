import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auditExtension } from './extensions/audit.extension';
import pg from 'pg';
import { softDeleteExtension } from './extensions/soft-delete.extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prismaClient: PrismaClient;

  readonly client: ReturnType<typeof this.initClient>;

  constructor(
    configService: ConfigService,
    private readonly cls: ClsService<GlobalClsStore>,
  ) {
    const connectString = new ConfigUltils(configService).getDataBaseURL();

    if (!connectString) throw new Error('DATABASE_URL is not set');

    const pool = new pg.Pool({ connectionString: connectString });
    const adapter = new PrismaPg(pool);

    this.prismaClient = new PrismaClient({ adapter });

    this.client = this.initClient();
  }

  private initClient() {
    return this.prismaClient
      .$extends(softDeleteExtension)
      .$extends(auditExtension(this.cls));
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }
  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
