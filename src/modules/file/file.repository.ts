import { AuditCreate, AuditUpdate } from '@/shared/types';
import { File, Prisma } from '@prisma/client';

import { CreateFileDto } from '@/modules/file/dto/create-file.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateFileDto } from '@/modules/file/dto/update-file.dto';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: AuditCreate<CreateFileDto>) {
    return await this.prisma.file.create({
      data: body as Prisma.FileUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: File['id'], body: AuditUpdate<UpdateFileDto>) {
    return await this.prisma.file.update({
      data: body as Prisma.FileUncheckedUpdateInput,
      where: {
        id,
      },
    });
  }

  async findMany(args: Prisma.FileFindManyArgs) {
    return await this.prisma.file.findMany(args);
  }

  async findUnique(args: Prisma.FileFindUniqueArgs) {
    return await this.prisma.file.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.FileFindUniqueArgs) {
    return await this.prisma.file.findUniqueOrThrow(args);
  }

  async deleted(id: File['id']) {
    return await this.prisma.file.delete({
      where: {
        id,
      },
    });
  }
}
