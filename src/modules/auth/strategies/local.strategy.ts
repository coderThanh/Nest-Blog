import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoUtil } from '@/common/utils/crypto.util';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { PassportStrategy } from '@nestjs/passport';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { Strategy } from 'passport-local';
import { UserRepository } from '@/modules/user/user.repository';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { cuid } from '@/common/utils/helper.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyType.local,
) {
  constructor(private userRepo: UserRepository) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    const user = await this.userRepo.findFirst({
      where: { username },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(ValidateMessage.loginFaild().rawMsg());
    }

    if (!(await CryptoUtil.compareHash(password, user.passwordHash))) {
      throw new UnauthorizedException(ValidateMessage.loginFaild().rawMsg());
    }

    return {
      sub: user.id,
      userId: user.id,
      email: user.email,
      jti: cuid(),
    } as JwtPayload;
  }
}
