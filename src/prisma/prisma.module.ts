import { Global, Module } from '@nestjs/common';

import { DbValidateService } from '@/prisma/db-validate.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, DbValidateService],
  exports: [PrismaService, DbValidateService],
})
export class PrismaModule {}
