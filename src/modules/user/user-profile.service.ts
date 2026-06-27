import { Injectable } from '@nestjs/common';
import { Role } from '@/modules/role/entities/role.entity';
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

  async findOneForAuthGuardUserOrThrow(id: string) {
    return this.userRepo.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        roleId: true,
      },
    });
  }
}
