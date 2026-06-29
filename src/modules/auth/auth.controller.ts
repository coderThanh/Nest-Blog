import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { LoginDto } from '@/modules/auth/dto/login.dto';

import { plainToInstance } from 'class-transformer';
import { LoginToken } from '@/modules/auth/entities/login-token.entity';
import { ApiCustomResponseOK } from '@/common/decorator/api-response-ok.decorator';
import {
  IpAddress,
  UserAgent,
} from '@/common/decorator/request-info.decorator';
import { RefreshtokenReturn } from '@/modules/auth/entities/refresh-token-return.entity';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiCustomResponseOK(LoginToken)
  async login(
    @Body() body: LoginDto, // hook class-validate
    @GetUser() userReq: JwtPayload, // get from LocalAuthGuard
    @IpAddress() ipAddress?: string,
    @UserAgent() userAgent?: string,
  ) {
    const tokens = await this.authService.login(userReq, {
      ipAddress,
      userAgent,
    });

    return plainToInstance(LoginToken, tokens, {
      excludeExtraneousValues: true,
    });
  }

  @Post('refreshtoken')
  @ApiCustomResponseOK(RefreshtokenReturn)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(body.refreshToken);

    return plainToInstance(RefreshtokenReturn, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
