import { AuditCreate, AuditUpdate } from '@/shared/types';
import { Category, Prisma } from '@prisma/client';

import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: AuditCreate<CreateCategoryDto>) {
    return await this.prisma.category.create({
      data: body as Prisma.CategoryUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: number, data: AuditUpdate<UpdateCategoryDto>) {
    return await this.prisma.category.update({
      data: data as Prisma.CategoryUncheckedUpdateInput,
      where: {
        id,
      },
    });
  }

  async findMany(args: Prisma.CategoryFindManyArgs) {
    return await this.prisma.category.findMany(args);
  }

  async findFirst(args: Prisma.CategoryFindFirstArgs) {
    return await this.prisma.category.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.CategoryFindFirstArgs) {
    return await this.prisma.category.findFirstOrThrow(args);
  }

  async findUnique(args: Prisma.CategoryFindUniqueArgs) {
    return await this.prisma.category.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.CategoryFindUniqueArgs) {
    return await this.prisma.category.findUniqueOrThrow(args);
  }

  async deleted(id: number) {
    return await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
