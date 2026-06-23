import { CategoryCreatedEvent } from '@/modules/category/events/category-created.event';
import { CategoryUpdatedEvent } from '@/modules/category/events/category-updated.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryEventListener {
  @OnEvent(CategoryCreatedEvent.name)
  async handleCategoryCreatedEvent(event: CategoryCreatedEvent) {
    const { categoryId, parentId, tx } = event;

    const path = await this.generateCategoryPath({
      id: categoryId,
      parentId,
      tx,
    });

    await tx.category.update({
      data: { path },
      where: { id: categoryId },
      select: { id: true },
    });
  }

  //
  @OnEvent(CategoryUpdatedEvent.name)
  async handleCategoryUpdatedEvent(event: CategoryUpdatedEvent) {
    const { categoryId, oldParentId, oldPath, newParentId, tx } = event;

    if (oldParentId === newParentId) return null;

    let newPath = await this.generateCategoryPath({
      id: categoryId,
      parentId: newParentId,
      tx,
    });

    // replace olpath form children

    await tx.$executeRaw`
      UPDATE "Category" 
      SET "path" = ${newPath} || SUBSTRING("path", LENGTH(${oldPath}) + 1) 
      WHERE "path" LIKE ${oldPath + '/%'}
    `;

    return await tx.category.update({
      data: { path: newPath },
      where: { id: categoryId },
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
