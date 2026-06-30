import { Prisma, PrismaClient } from '@prisma/client';
import { UpdateUserDto, UpdateUserSelfDto } from './dto/update-user.dto';
import {
  formatToPhoneE164,
  removeVietnameseAccents,
} from '@/common/utils/helper.util';

import { CreateUserDto } from './dto/create-user.dto';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { DatabaseUltil } from '@/common/utils/database.util';
import { DatabaseValidate } from '@/common/utils/database-validate..util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { FindAllUserDto } from '@/modules/user/dto/find-all-user.dto';
import { Injectable } from '@nestjs/common';
import { Role } from '@/modules/role/entities/role.entity';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly dbValidate: DbValidateService,
    private readonly userRepo: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, repeatPassword, phone, ...restBody } = createUserDto;
    // Validate
    await DatabaseValidate.validateOrThrow([
      //
      this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.User,
        {
          email: createUserDto.email,
        },
        Prisma.UserScalarFieldEnum.email,
      ),
      //
      this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.User,
        {
          username: createUserDto.username,
        },
        Prisma.UserScalarFieldEnum.username,
      ),
      //
      this.dbValidate.validateRecordExistOrThrow(
        Prisma.ModelName.Role,
        createUserDto.roleId,
        Prisma.UserScalarFieldEnum.roleId,
      ),
    ]);

    // Normalize
    const normalPhone = UserService.normalizePhone(phone ?? null);

    const passwordHash: string = await CryptoUtil.hash(password);

    return this.userRepo.create({
      ...restBody,
      phone: normalPhone,
      passwordHash,
    });
  }

  async findAll(query: FindAllUserDto) {
    return this.userRepo.findMany(UserService.getCommonFindManyInput(query));
  }

  async findAllAndCount(query: FindAllUserDto) {
    return this.userRepo.findManyAndCount(
      UserService.getCommonFindManyInput(query),
    );
  }

  async findOne(id: string) {
    return this.userRepo.findUnique({
      where: { id },
      include: UserService.getCommonInclue(),
    });
  }

  async findOneOrThorw(id: string) {
    return this.userRepo.findUniqueOrThrow({
      where: { id },
      include: UserService.getCommonInclue(),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto | UpdateUserSelfDto) {
    const record = await this.userRepo.findUniqueOrThrow({
      where: { id },
      select: { email: true },
    });

    // Validate
    await DatabaseValidate.validateOrThrow([
      updateUserDto.email &&
        record.email !== updateUserDto.email &&
        this.dbValidate.validateUniqueOrThrow(
          Prisma.ModelName.User,
          {
            email: updateUserDto.email,
            id: { not: id },
          },
          Prisma.UserScalarFieldEnum.email,
        ),
      'roleId' in updateUserDto &&
        updateUserDto.roleId &&
        updateUserDto.roleId !== record.roleId &&
        this.dbValidate.validateRecordExistOrThrow(
          Prisma.ModelName.Role,
          updateUserDto.roleId,
          Prisma.UserScalarFieldEnum.roleId,
        ),
    ]);

    let emailFinal = record.email;
    let isChangeNewEmail = false;

    //  reset verified email
    if (updateUserDto.email && record.email !== updateUserDto.email) {
      emailFinal = updateUserDto.email;
      isChangeNewEmail = true;
    }

    const normalPhone = UserService.normalizePhone(updateUserDto.phone ?? null);

    return this.userRepo.patch(id, {
      ...updateUserDto,
      phone: normalPhone,
      email: emailFinal,
      emailVerifiedAt: isChangeNewEmail ? null : undefined,
    });
  }

  async remove(id: string) {
    return this.userRepo.softDelete(id);
  }

  //
  static getCommonInclue(): Prisma.UserInclude {
    return {
      role: { select: Role.selectRelation },
      thumbnal: { select: FileEntity.selectRelation },
      createdByUser: { select: User.selectRelation },
    };
  }

  static normalizePhone(phone: string | null) {
    return typeof phone === 'string' ? formatToPhoneE164(phone) : phone;
  }

  static getCommonFindManyInput(
    query: FindAllUserDto,
  ): Prisma.UserFindManyArgs {
    const { page, limit, orderBy, orderDir } = query;

    const sort: Prisma.UserOrderByWithRelationInput = {
      [orderBy as Prisma.UserScalarFieldEnum]: orderDir,
    };

    return {
      where: UserService.getCommonWhere(query),
      select: {
        ...User.selectFindMany,
        ...UserService.getCommonInclue(),
      },
      orderBy: sort,
      take: limit,
      skip: DatabaseUltil.getSkip(page, limit),
    };
  }

  static getCommonWhere(query: FindAllUserDto): Prisma.UserWhereInput {
    const { ids, excludeIds, roleId, search } = query;
    const andCondition: Prisma.UserWhereInput[] = [];

    if (ids?.length) andCondition.push({ id: { in: ids } });

    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    if (roleId) andCondition.push({ roleId: roleId });

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

    return { AND: andCondition };
  }
}
