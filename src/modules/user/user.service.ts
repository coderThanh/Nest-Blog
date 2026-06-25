import { CreateUserDto } from './dto/create-user.dto';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { DatabaseValidate } from '@/common/utils/database-validate..util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/user.repository';
import { formatToPhoneE164 } from '@/common/utils/helper.util';

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
    ]);

    // Normalize
    const { normalPhone } = await UserService.normalizeFields({
      phone,
    });

    const passwordHash: string = await CryptoUtil.hash(password);

    return this.userRepo.create({
      ...restBody,
      phone: normalPhone,
      passwordHash,
      createdBy: null,
    });
  }

  async findAll() {
    return `This action returns all user`;
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

  async update(id: string, updateUserDto: UpdateUserDto) {
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
    ]);

    const { normalPhone } = await UserService.normalizeFields({
      phone: updateUserDto.phone,
    });

    return this.userRepo.patch(id, { ...updateUserDto, phone: normalPhone });
  }

  async remove(id: string) {
    return this.userRepo.softDelete(id, {
      deletedBy: null,
      deletedAt: new Date().toISOString(),
    });
  }

  //
  static getCommonInclue(): Prisma.UserInclude {
    return {
      thumbnal: { select: FileEntity.selectRelation },
      createdByUser: { select: User.selectRelation },
    };
  }

  static async normalizeFields(params: {
    password?: string;
    phone?: string | null;
  }) {
    const { password, phone } = params;

    let passwordHash = password ? await CryptoUtil.hash(password) : undefined;

    const normalPhone =
      typeof phone === 'string' ? formatToPhoneE164(phone) : phone;

    return {
      passwordHash,
      normalPhone,
    };
  }
}
