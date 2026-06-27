import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FindAllRoleDto } from '@/modules/role/dto/find-all-role.dto';
import { Prisma } from '@prisma/client';
import { Role } from '@/modules/role/entities/role.entity';
import { RoleRepository } from '@/modules/role/role.repository';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionDto } from '@/modules/role/dto/update-role-permission.dto';
import { User } from '@/modules/user/entities/user.entity';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { removeVietnameseAccents } from '@/common/utils/helper.util';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly dbValidate: DbValidateService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    await this.dbValidate.validateUniqueOrThrow(
      Prisma.ModelName.Role,
      { name: createRoleDto.name },
      Prisma.RoleScalarFieldEnum.name,
    );

    return this.roleRepo.create(createRoleDto);
  }

  async findAll(query: FindAllRoleDto) {
    return this.roleRepo.findMany(RoleService.getCommonFindAll(query));
  }

  async findAllOrCount(query: FindAllRoleDto) {
    return this.roleRepo.findManyAndCount(RoleService.getCommonFindAll(query));
  }

  async findOne(id: string) {
    return this.roleRepo.findUnique({
      where: { id },
      include: RoleService.getCommonInclude(),
    });
  }

  async findOneOrthrow(id: string) {
    return this.roleRepo.findUniqueOrThrow({
      where: { id },
      include: RoleService.getCommonInclude(),
    });
  }

  async findOneIncludePermissions(id: string) {
    return this.roleRepo.findUnique({
      where: { id },
      include: {
        ...RoleService.getCommonInclude(),
        ...RoleService.getCommonIncluePermissions(),
      },
    });
  }

  async findOneIncludePermissionsOrthrow(id: string) {
    return this.roleRepo.findUniqueOrThrow({
      where: { id },
      include: {
        ...RoleService.getCommonInclude(),
        ...RoleService.getCommonIncluePermissions(),
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const curr = await this.roleRepo.findUniqueOrThrow({
      where: { id },
      select: { id: true, name: true },
    });

    if (updateRoleDto.name && updateRoleDto.name !== curr.name) {
      await this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.Role,
        { name: updateRoleDto.name, id: { not: id } },
        Prisma.RoleScalarFieldEnum.name,
      );
    }

    return this.roleRepo.patch(id, updateRoleDto);
  }

  async setPermission(id: string, updateRoleDto: UpdateRolePermissionDto) {
    return this.roleRepo.setPermission(id, updateRoleDto);
  }

  async remove(id: string) {
    const curr = await this.roleRepo.findUniqueOrThrow({
      where: { id },
      select: { isSystem: true },
    });

    if (curr.isSystem) {
      throw new BadRequestException(
        ValidateMessage.isSystemDoNotDelete().rawMsg(),
      );
    }

    await this.dbValidate.validateNoConnectOrThrow(Prisma.ModelName.User, {
      roleId: id,
    });

    return this.roleRepo.delete(id);
  }

  /** */
  static getCommonInclude(): Prisma.RoleInclude {
    return {
      createdByUser: { select: User.selectRelation },
    };
  }

  static getCommonWhere(query: FindAllRoleDto): Prisma.RoleWhereInput {
    const { ids, excludeIds, search, isSystem } = query;

    const andCondition: Prisma.RoleWhereInput[] = [];

    if (ids?.length) andCondition.push({ id: { in: ids } });

    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    if (isSystem !== undefined) andCondition.push({ isSystem: isSystem });

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

    return { AND: andCondition };
  }

  static getCommonFindAll(query: FindAllRoleDto): Prisma.RoleFindManyArgs {
    const { limit, page, orderBy, orderDir } = query;

    const sort: Prisma.RoleOrderByWithRelationInput = { [orderBy]: orderDir };

    return {
      where: RoleService.getCommonWhere(query),
      select: {
        ...Role.selectFindAll,
        ...RoleService.getCommonInclude(),
      },
      take: limit,
      skip: DatabaseUltil.getSkip(page, limit),
      orderBy: sort,
    };
  }

  static getCommonIncluePermissions(): Prisma.RoleInclude {
    return {
      permissions: {
        select: {
          scope: true,
          permission: {
            select: {
              permission: true,
            },
          },
        },
      },
    };
  }
}
