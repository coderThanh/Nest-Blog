import { AuditCreate, AuditUpdate } from '@/shared/types';
import { Post, Prisma } from '@prisma/client';

import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdatePostDto } from '@/modules/post/dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: AuditCreate<CreatePostDto>) {
    const { categoryIds, ...rest } = body;

    return this.prisma.post.create({
      data: {
        ...rest,
        categories: categoryIds
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      select: { id: true, slug: true, name: true },
    });
  }

  async patch(id: Post['id'], body: AuditUpdate<UpdatePostDto>) {
    const { categoryIds, ...rest } = body;

    return this.prisma.post.update({
      data: {
        ...rest,
        categories:
          categoryIds !== undefined
            ? categoryIds === null
              ? { set: [] }
              : { set: categoryIds.map((id) => ({ id })) }
            : undefined,
      },
      where: { id },
    });
  }

  async findMany(args: Prisma.PostFindManyArgs) {
    return this.prisma.post.findMany(args);
  }

  async findManyAndCount(args: Prisma.PostFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.post.findMany(args),
      this.prisma.post.count({ where }),
    ]);

    return { items, total };
  }

  async findUnique(args: Prisma.PostFindUniqueArgs) {
    return this.prisma.post.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.PostFindUniqueArgs) {
    return this.prisma.post.findUniqueOrThrow(args);
  }

  async findFirst(args: Prisma.PostFindFirstArgs) {
    return this.prisma.post.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.PostFindFirstArgs) {
    return this.prisma.post.findFirstOrThrow(args);
  }

  async delete(id: Post['id']) {
    return this.prisma.post.delete({
      where: {
        id,
      },
      select: { id: true },
    });
  }
}
