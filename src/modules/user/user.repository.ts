import { Prisma, User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateUserDto) {
    return await this.prisma.user.create({
      data: body as Prisma.UserUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: User['id'], data: UpdateUserDto) {
    return await this.prisma.user.update({
      data: data as Prisma.UserUncheckedUpdateInput,
      where: { id },
    });
  }

  async findMany(args: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(args);
  }

  async findFirst(args: Prisma.UserFindFirstArgs) {
    return await this.prisma.user.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.UserFindFirstArgs) {
    return await this.prisma.user.findFirstOrThrow(args);
  }

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return await this.prisma.user.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.UserFindUniqueArgs) {
    return await this.prisma.user.findUniqueOrThrow(args);
  }

  async deleted(id: User['id']) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
