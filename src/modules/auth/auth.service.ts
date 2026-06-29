import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  JwtDecodedPayload,
  LoginRequestInfo,
} from '@/modules/auth/types/auth.type';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '@/modules/auth/session.repository';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class AuthService {
  config: ConfigUltils;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionRepo: SessionRepository,
  ) {
    this.config = new ConfigUltils(this.configService);
  }

  async login(payload: JwtPayload, meta?: LoginRequestInfo) {
    const tokens = await this.generateTokens(payload);

    const refreshTokenPayload = this.jwtService.decode<JwtDecodedPayload>(
      tokens.refreshToken,
    );

    const refreshtokenHash = await CryptoUtil.hash(tokens.refreshToken);

    await this.sessionRepo.create({
      id: refreshTokenPayload.jti,
      refreshtokenHash: refreshtokenHash,
      userAgent: meta?.userAgent ?? null,
      ipAddress: meta?.ipAddress ?? null,
      userId: refreshTokenPayload.sub,
      expiresAt: new Date(refreshTokenPayload.exp * 1000).toISOString(),
    });

    return tokens;
  }

  async logout(sessionId: string) {
    // validate record
    await this.sessionRepo.findUniqueOrThrow({ where: { id: sessionId } });

    return this.sessionRepo.delete(sessionId);
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
      const payload = await this.jwtService.verifyAsync<JwtDecodedPayload>(
        refreshToken,
        {
          secret: this.config.getJwtRefreshSecret(),
        },
      );

      // check revoke token
      const session = await this.sessionRepo.findUniqueOrThrow({
        where: {
          id: payload.jti,
        },
        select: { refreshtokenHash: true },
      });

      if (
        !(await CryptoUtil.compareHash(refreshToken, session.refreshtokenHash))
      ) {
        throw new UnauthorizedException(
          ValidateMessage.unauthorized().rawMsg(),
        );
      }

      // No RefreshToken rotaion
      const accessToken = await this.generateAccessToken({
        sub: payload.sub,
        email: payload.email,
        userId: payload.userId,
        jti: payload.jti, // if payload has exp and iat will throw error
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(ValidateMessage.notFoundToken().rawMsg());
    }
  }
}
