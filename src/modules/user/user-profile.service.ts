import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Role } from '@/modules/role/entities/role.entity';
import { UpdateUserSelfDto } from '@/modules/user/dto/update-user.dto';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class UserProfileService {
  constructor(private readonly userRepo: UserRepository) {}

  async findProfile(id: string) {
    return this.userRepo.findUniqueOrThrow({
      where: { id },
      include: {
        ...UserService.getCommonInclue(),
        role: {
          select: Role.selectRelationEmbedPermission,
        },
      },
    });
  }

  async findOne(id: string, select?: Prisma.UserSelect) {
    return this.userRepo.findUnique({
      where: { id },
      select: select,
    });
  }

  async findOneOrThrow(id: string, select?: Prisma.UserSelect) {
    return this.userRepo.findUniqueOrThrow({
      where: { id },
      select: select,
    });
  }

  async findFirstByUserName(username: string, select?: Prisma.UserSelect) {
    return this.userRepo.findFirst({
      where: { username },
      select: select,
    });
  }
}
