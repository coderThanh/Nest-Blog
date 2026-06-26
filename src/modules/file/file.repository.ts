import { File, Prisma } from '@prisma/client';

import { CreateFileDto } from '@/modules/file/dto/create-file.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateFileDto } from '@/modules/file/dto/update-file.dto';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateFileDto) {
    return await this.prisma.client.file.create({
      data: body as Prisma.FileUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: File['id'], body: UpdateFileDto) {
    return await this.prisma.client.file.update({
      data: body as Prisma.FileUncheckedUpdateInput,
      where: {
        id,
      },
    });
  }

  async findMany(args: Prisma.FileFindManyArgs) {
    return await this.prisma.client.file.findMany(args);
  }

  async findUnique(args: Prisma.FileFindUniqueArgs) {
    return await this.prisma.client.file.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.FileFindUniqueArgs) {
    return await this.prisma.client.file.findUniqueOrThrow(args);
  }

  async deleted(id: File['id']) {
    return await this.prisma.client.file.delete({
      where: {
        id,
      },
    });
  }
}
