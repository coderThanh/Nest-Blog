import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { ForgotPasswordDto } from '@/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto';
import { TokenService } from '@/modules/token/token.service';
import { TokenType } from '@prisma/client';
import { UserRepository } from '@/modules/user/user.repository';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class PasswordService {
  private config: ConfigUltils;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.config = new ConfigUltils(configService);
  }

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

    await this.userRepo.patch(userId, {
      passwordHash,
    });
  }

  //
  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userRepo.findFirstOrThrow({
      where: { email: body.email },
      select: { id: true, email: true },
    });

    const expiresAt = new Date();

    expiresAt.setMinutes(
      expiresAt.getMinutes() +
        (this.config.getPasswordResetExpiresInMinutes() ?? 15),
    );

    const token = await this.tokenService.create({
      type: TokenType.PASSWORD_RESET,
      userId: user.id,
      expiresAt: expiresAt.toISOString(),
    });

    // Real project will send email instead of return token
    return token;
  }

  async resetPassword(body: ResetPasswordDto) {
    const token = await this.tokenService.findOnByTokenOrThrow(
      body.token,
      new Date().toISOString(), // check expires
    );

    if (token.type !== TokenType.PASSWORD_RESET) {
      throw new BadRequestException(ValidateMessage.notFoundToken().rawMsg());
    }

    // validate User
    const user = await this.userRepo.findUniqueOrThrow({
      where: { id: token.userId },
      select: { id: true },
    });

    const passwordHash = await CryptoUtil.hash(body.password);

    await this.userRepo.patch(user.id, {
      passwordHash,
    });

    // delete token
    await this.tokenService.removeByTokenOrThrow(token.token);
  }
}
