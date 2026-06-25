import { AuditCreate, AuditUpdate } from '@/shared/types/write';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';

import { CreateTagDto } from '@/modules/tag/dto/create-tag.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateTagDto } from '@/modules/tag/dto/update-tag.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: AuditCreate<CreateTagDto>) {
    return this.prisma.client.tag.create({
      data: body as Prisma.TagUncheckedCreateInput,
      select: { id: true, slug: true },
    });
  }

  async patch(id: Tag['id'], data: AuditUpdate<UpdateTagDto>) {
    return this.prisma.client.tag.update({
      data: data as Prisma.TagUncheckedUpdateInput,
      where: { id },
    });
  }

  async findMany(args: Prisma.TagFindManyArgs) {
    return this.prisma.client.tag.findMany(args);
  }

  async findManyAndCount(args: Prisma.TagFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.tag.findMany(args),
      this.prisma.client.tag.count({ where }),
    ]);

    return { items, total };
  }

  async findFirst(args: Prisma.TagFindFirstArgs) {
    return this.prisma.client.tag.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.TagFindFirstArgs) {
    const record = await this.prisma.client.tag.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.TagFindUniqueArgs) {
    return this.prisma.client.tag.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.TagFindUniqueArgs) {
    const record = await this.prisma.client.tag.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async delete(id: Tag['id']) {
    return this.prisma.client.tag.delete({
      where: { id },
      select: { id: true },
    });
  }
}
