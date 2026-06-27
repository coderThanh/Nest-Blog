import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { ClsService } from 'nestjs-cls';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService<GlobalClsStore>,
  ) {}

  async create(
    body: Omit<CreateUserDto, 'password' | 'repeatPassword'> & {
      passwordHash: string;
    },
  ) {
    return this.prisma.client.user.create({
      data: body as Prisma.UserUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: User['id'], body: UpdateUserDto & { passwordHash?: string }) {
    return this.prisma.client.user.update({
      data: body as Prisma.UserUncheckedUpdateInput,
      where: { id },
    });
  }

  async findMany(args: Prisma.UserFindManyArgs) {
    return this.prisma.client.user.findMany(args);
  }

  async findManyAndCount(args: Prisma.UserFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.user.findMany(args),
      this.prisma.client.user.count({ where }),
    ]);

    return { items, total };
  }

  async findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prisma.client.user.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.UserFindFirstArgs) {
    const record = await this.prisma.client.user.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFoundUser().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.prisma.client.user.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.UserFindUniqueArgs) {
    const record = await this.prisma.client.user.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFoundUser().rawMsg());

    return record;
  }

  async softDelete(id: User['id']) {
    const authId = this.cls.get('userId');

    return this.prisma.client.user.update({
      where: { id },
      data: {
        deletedBy: authId,
        deletedAt: new Date().toISOString(),
      },
      select: { id: true },
    });
  }
}
