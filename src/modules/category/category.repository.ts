import { AuditCreate, AuditUpdate } from '@/shared/types';
import { Category, Prisma } from '@prisma/client';

import { CategoryCreatedEvent } from '@/modules/category/events/category-created.event';
import { CategoryUpdatedEvent } from '@/modules/category/events/category-updated.event';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class CategoryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitEvent: EventEmitter2,
  ) {}

  async create(body: AuditCreate<CreateCategoryDto>) {
    return await this.prisma.$transaction(async (ctx) => {
      const record = await ctx.category.create({
        data: body,
        select: { id: true },
      });

      // event
      const event = new CategoryCreatedEvent({
        parentId: body.parentId ?? null,
        categoryId: record.id,
        tx: ctx,
      });

      await validateOrReject(event);

      await this.emitEvent.emitAsync(CategoryCreatedEvent.name, event);

      return record;
    });
  }

  async patch(id: number, data: AuditUpdate<UpdateCategoryDto>) {
    return await this.prisma.$transaction(async (ctx) => {
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

      // event
      const event = new CategoryUpdatedEvent({
        categoryId: id,
        oldPath: oldRecord.path,
        oldParentId: oldRecord.parentId,
        newParentId: data.parentId ?? null,
        tx: ctx,
      });

      await validateOrReject(event);

      const newRecordAfterUpdatePath = await this.emitEvent.emitAsync(
        CategoryUpdatedEvent.name,
        event,
      );

      return newRecordAfterUpdatePath[0]
        ? newRecordAfterUpdatePath[0]
        : newRerod;
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
      select: { id: true },
    });
  }
}
