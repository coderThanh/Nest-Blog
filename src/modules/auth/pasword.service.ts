import { BadRequestException, Injectable } from '@nestjs/common';

import { CryptoUtil } from '@/common/utils/crypto.util';
import { UserRepository } from '@/modules/user/user.repository';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class PasswordService {
  constructor(private readonly userRepo: UserRepository) {}

  //
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // repeat password check at class-validate
    const user = await this.userRepo.findUniqueOrThrow({
      where: { id: userId },
      select: {
        passwordHash: true,
      },
    });

    if (!(await CryptoUtil.compareHash(oldPassword, user.passwordHash))) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          'oldPassword',
          'Mật khẩu cũ không đúng',
        ),
      );
    }

    const passwordHash = await CryptoUtil.hash(newPassword);

    return this.userRepo.patch(userId, {
      passwordHash,
    });
  }
}
