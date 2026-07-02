import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.client.$transaction(async (ctx) => {
      const record = await ctx.category.create({
        data: data as Prisma.CategoryUncheckedCreateInput,
        select: { id: true },
      });

      //
      const path = await this.generateCategoryPath({
        id: record.id,
        parentId: data.parentId ?? null,
        tx: ctx as Prisma.TransactionClient,
      });

      return await ctx.category.update({
        data: { path },
        where: { id: record.id },
        select: { id: true, slug: true, name: true },
      });
    });
  }

  async patch(id: number, body: UpdateCategoryDto) {
    const data: Prisma.CategoryUncheckedUpdateInput = {
      ...body,
    };

    return this.prisma.client.$transaction(async (ctx) => {
      const oldRecord = await ctx.category.findUniqueOrThrow({
        where: { id },
        select: { path: true, parentId: true },
      });

      const newRerod = await ctx.category.update({
        data: data,
        where: {
          id,
        },
      });

      // update path on leaft
      const oldParentId = oldRecord.parentId;
      const oldPath = oldRecord.path;

      const newParentId = newRerod.parentId;

      if (oldParentId === newParentId) return null;

      let newPath = await this.generateCategoryPath({
        id: id,
        parentId: newParentId,
        tx: ctx as Prisma.TransactionClient,
      });

      // replace olpath form children
      await ctx.$executeRaw[
        `
      UPDATE "Category" 
      SET "path" = ${newPath} || SUBSTRING("path", LENGTH(${oldPath}) + 1) 
      WHERE "path" LIKE ${oldPath + '/%'}
    `
      ];

      return await ctx.category.update({
        data: { path: newPath },
        where: { id },
      });
    });
  }

  async findMany(args: Prisma.CategoryFindManyArgs) {
    return this.prisma.client.category.findMany(args);
  }

  async findManyAndCount(args: Prisma.CategoryFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.category.findMany(args),
      this.prisma.client.category.count({ where }),
    ]);

    return { items, total };
  }

  async findFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.prisma.client.category.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.CategoryFindFirstArgs) {
    const record = await this.prisma.client.category.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.prisma.client.category.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.CategoryFindUniqueArgs) {
    const record = await this.prisma.client.category.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async deleted(id: number) {
    return this.prisma.client.$transaction(async (ctx) => {
      const record = await ctx.category.findUniqueOrThrow({
        where: { id },
        select: { path: true },
      });

      const path = record.path;

      await ctx.$executeRaw`update "Category" set "path" = replace("path", ${path}, '') where "path" like ${path + '/%'}`;

      return ctx.category.delete({
        where: {
          id,
        },
        select: { id: true },
      });
    });
  }

  private async generateCategoryPath(params: {
    id: number;
    parentId: number | null;
    tx: Prisma.TransactionClient;
  }): Promise<string> {
    const { id, parentId, tx } = params;

    let path = `/${id}`;

    if (parentId) {
      const parent = await tx.category.findUniqueOrThrow({
        where: { id: parentId },
        select: { path: true },
      });

      path = parent.path + `/${id}`;
    }

    return path;
  }
}
