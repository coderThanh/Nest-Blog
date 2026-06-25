import { AuditCreate, AuditUpdate } from '@/shared/types/write';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';

import { Category } from '@/modules/category/entities/category.entity';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Tag } from '@/modules/tag/entities/tag.entity';
import { UpdatePostDto } from '@/modules/post/dto/update-post.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: AuditCreate<CreatePostDto>) {
    const { categoryIds, tagIds, ...rest } = body;

    return this.prisma.client.post.create({
      data: {
        ...rest,
        categories: categoryIds
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
        tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
      select: { id: true, slug: true, name: true },
    });
  }

  async patch(id: Post['id'], body: AuditUpdate<UpdatePostDto>) {
    const { categoryIds, tagIds, ...rest } = body;

    return this.prisma.client.post.update({
      data: {
        ...rest,
        categories:
          categoryIds !== undefined
            ? categoryIds === null
              ? { set: [] }
              : { set: categoryIds.map((id) => ({ id })) }
            : undefined,
        tags:
          tagIds !== undefined
            ? tagIds === null
              ? { set: [] }
              : { set: tagIds.map((id) => ({ id })) }
            : undefined,
      },
      where: { id },
      include: {
        categories: { select: Category.selectCategoryRelation },
        tags: { select: Tag.selectRelation },
      },
    });
  }

  async findMany(args: Prisma.PostFindManyArgs) {
    return this.prisma.client.post.findMany(args);
  }

  async findManyAndCount(args: Prisma.PostFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.post.findMany(args),
      this.prisma.client.post.count({ where }),
    ]);

    return { items, total };
  }

  async findUnique(args: Prisma.PostFindUniqueArgs) {
    return this.prisma.client.post.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.PostFindUniqueArgs) {
    const record = await this.prisma.client.post.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findFirst(args: Prisma.PostFindFirstArgs) {
    return this.prisma.client.post.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.PostFindFirstArgs) {
    const record = await this.prisma.client.post.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async delete(id: Post['id']) {
    return this.prisma.client.post.delete({
      where: {
        id,
      },
      select: { id: true },
    });
  }
}
