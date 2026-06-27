import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';

import { ClsService } from 'nestjs-cls';
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateRoleDto } from '@/modules/role/dto/update-role.dto';
import { UpdateRolePermissionDto } from '@/modules/role/dto/update-role-permission.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class RoleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService<GlobalClsStore>,
  ) {}

  async create(body: CreateRoleDto) {
    return this.prisma.client.role.create({
      data: body as Prisma.RoleUncheckedCreateInput,
      select: { id: true },
    });
  }

  async patch(id: Role['id'], body: UpdateRoleDto) {
    return this.prisma.client.role.update({
      data: body as Prisma.RoleUncheckedUpdateInput,
      where: { id },
    });
  }

  async setPermission(id: Role['id'], body: UpdateRolePermissionDto) {
    return this.prisma.client.role.update({
      where: { id },
      data: {
        permissions: {
          // 1. Xóa sạch tất cả các permission cũ của Role này
          deleteMany: {},

          // 2. Tạo loạt permission
          create: body.items,
        },
      },
    });
  }

  async findMany(args: Prisma.RoleFindManyArgs) {
    return this.prisma.client.role.findMany(args);
  }

  async findManyAndCount(args: Prisma.RoleFindManyArgs) {
    const { where } = args;

    const [items, total] = await Promise.all([
      this.prisma.client.role.findMany(args),
      this.prisma.client.role.count({ where }),
    ]);

    return { items, total };
  }

  async findFirst(args: Prisma.RoleFindFirstArgs) {
    return this.prisma.client.role.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.RoleFindFirstArgs) {
    const record = await this.prisma.client.role.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.RoleFindUniqueArgs) {
    return this.prisma.client.role.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.RoleFindUniqueArgs) {
    const record = await this.prisma.client.role.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async delete(id: Role['id']) {
    return this.prisma.client.role.delete({
      where: { id },
      select: { id: true },
    });
  }
}
