import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { TokenService } from '@/modules/token/token.service';
import { TokenType } from '@prisma/client';
import { UserRepository } from '@/modules/user/user.repository';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { VerifyEmailDto } from '@/modules/auth/dto/verify-email.dto';

@Injectable()
export class VerifyAccountService {
  private config: ConfigUltils;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.config = new ConfigUltils(configService);
  }

  //
  async requiredVerifyEmail(userId: string) {
    // userid được validate ở JwtGuard rồi không cần check lại
    const expiresAt = new Date();

    expiresAt.setHours(
      expiresAt.getHours() + (this.config.getVerifyEmailExpiresInHours() ?? 24),
    );

    const token = await this.tokenService.create({
      userId,
      expiresAt: expiresAt.toISOString(),
      type: TokenType.EMAIL_VERIFICATION,
    });

    // trên product sẽ gửi email thay vì return token
    return token;
  }

  async verifyEmail(userId: string, body: VerifyEmailDto) {
    const token = await this.tokenService.findOnByTokenOrThrow(
      body.token,
      new Date().toISOString(),
    );

    if (token.type !== TokenType.EMAIL_VERIFICATION) {
      throw new BadRequestException(ValidateMessage.notFoundToken().rawMsg());
    }

    if (token.userId !== userId) {
      throw new BadRequestException(ValidateMessage.notFoundToken().rawMsg());
    }

    const user = await this.userRepo.patch(userId, {
      emailVerifiedAt: new Date().toISOString(),
    });

    this.tokenService.removeByTokenOrThrow(token.token);

    return user;
  }
}
