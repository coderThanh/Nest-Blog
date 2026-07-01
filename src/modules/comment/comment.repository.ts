import { Comment, Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCommentDto } from '@/modules/comment/dto/create-comment.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCommentDto } from '@/modules/comment/dto/update-comment.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateCommentDto) {
    return this.prisma.client.comment.create({
      data: body as Prisma.CommentUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: Comment['id'], body: UpdateCommentDto) {
    return this.prisma.client.comment.update({
      data: body as Prisma.CommentUncheckedUpdateInput,
      where: { id },
    });
  }

  async findMany(args: Prisma.CommentFindManyArgs) {
    return this.prisma.client.comment.findMany(args);
  }

  async findManyAndCount(args: Prisma.CommentFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.comment.findMany(args),
      this.prisma.client.comment.count({ where }),
    ]);

    return { items, total };
  }

  async findFirst(args: Prisma.CommentFindFirstArgs) {
    return this.prisma.client.comment.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.CommentFindFirstArgs) {
    const record = await this.prisma.client.comment.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.CommentFindUniqueArgs) {
    return this.prisma.client.comment.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.CommentFindUniqueArgs) {
    const record = await this.prisma.client.comment.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async delete(id: Comment['id']) {
    return this.prisma.client.comment.delete({
      where: { id },
      select: { id: true },
    });
  }
}
