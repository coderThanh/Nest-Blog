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

    return await this.prisma.post.create({
      data: {
        ...rest,
        categories: categoryIds
          ? { set: categoryIds.map((id) => ({ id })) }
          : undefined,
      } as Prisma.PostUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: Post['id'], body: AuditUpdate<UpdatePostDto>) {
    const { categoryIds, ...rest } = body;

    return await this.prisma.post.update({
      data: {
        ...rest,
        categories:
          categoryIds !== undefined
            ? categoryIds === null
              ? { set: null }
              : { set: categoryIds.map((id) => ({ id })) }
            : undefined,
      } as Prisma.PostUncheckedUpdateInput,
      where: { id },
    });
  }

  async findMany(args: Prisma.PostFindManyArgs) {
    return await this.prisma.post.findMany(args);
  }

  async findUnique(args: Prisma.PostFindUniqueArgs) {
    return await this.prisma.post.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.PostFindUniqueArgs) {
    return await this.prisma.post.findUniqueOrThrow(args);
  }

  async deleted(id: Post['id']) {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
