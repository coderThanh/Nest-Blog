import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '@/modules/auth/session.repository';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class AuthService {
  config: ConfigUltils;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionRepo: SessionRepository,
    private readonly profileService: UserProfileService,
  ) {
    this.config = new ConfigUltils(this.configService);
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getJwtAccessSecret(),
      expiresIn: this.config.getJwtAccessExpiresIn() as any,
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getJwtRefreshSecret(),
      expiresIn: this.config.getJwtRefreshExpiresIn() as any,
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.config.getJwtRefreshSecret(),
        },
      );

      // check revoke token
      const refreshTokenHas = await CryptoUtil.hash(refreshToken);

      await this.sessionRepo.findUniqueOrThrow({
        where: {
          refreshtokenHash: refreshTokenHas,
        },
        select: { id: true },
      });

      // No RefreshToken rotaion
      const accessToken = await this.generateAccessToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(ValidateMessage.notFoundToken().rawMsg());
    }
  }
}
