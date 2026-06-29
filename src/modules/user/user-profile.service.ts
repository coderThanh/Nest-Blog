import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoUtil } from '@/common/utils/crypto.util';
import { Role } from '@/modules/role/entities/role.entity';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class UserProfileService {
  constructor(private readonly userRepo: UserRepository) {}

  async validateLoginUserOrThrow(username: string, password: string) {
    const user = await this.userRepo.findFirst({
      where: { username: username },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user) {
      throw new UnauthorizedException(ValidateMessage.loginFaild().rawMsg());
    }

    if (!(await CryptoUtil.compareHash(password, user.passwordHash))) {
      throw new UnauthorizedException(ValidateMessage.loginFaild().rawMsg());
    }
    return user;
  }

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
