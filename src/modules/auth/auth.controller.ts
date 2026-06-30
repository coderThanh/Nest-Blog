import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { JwtPayload, ReqUserEmbed } from '@/shared/entities/auth.entity';
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
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UpdatePasswordDto } from '@/modules/auth/dto/update-password.dto';
import { PasswordService } from '@/modules/auth/pasword.service';
import { ForgotPasswordDto } from '@/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto';
import { VerifyEmailDto } from '@/modules/auth/dto/verify-email.dto';
import { VerifyAccountService } from '@/modules/auth/verify-account.service';
import { User } from '@/modules/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
    private readonly verfiryAccountService: VerifyAccountService,
  ) {}

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

  @Post('logout')
  @ApiAuthJwt()
  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseOK(null)
  async logout(@GetUser() user: ReqUserEmbed) {
    return await this.authService.logout(user.jti);
  }

  @Post('refresh-token')
  @ApiCustomResponseOK(RefreshtokenReturn)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(body.refreshToken);

    return plainToInstance(RefreshtokenReturn, tokens, {
      excludeExtraneousValues: true,
    });
  }

  @Post('forgot-password')
  @ApiCustomResponseOK(null)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.passwordService.forgotPassword(body);
  }

  @Post('reset-password')
  @ApiCustomResponseOK(null)
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.passwordService.resetPassword(body);
  }

  @Post('update-password')
  @ApiAuthJwt()
  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseOK(null)
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @GetUser('sub') userId: string,
  ) {
    await this.passwordService.updatePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Post('reuquire-verify-email')
  @ApiAuthJwt()
  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseOK(null)
  async requireVerifyEmail(@GetUser() user: ReqUserEmbed) {
    return await this.verfiryAccountService.requiredVerifyEmail(user.userId);
  }

  @Post('verify-email')
  @ApiAuthJwt()
  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseOK(User)
  async verifyEmail(
    @GetUser() user: ReqUserEmbed,
    @Body() body: VerifyEmailDto,
  ) {
    const record = await this.verfiryAccountService.verifyEmail(
      user.userId,
      body,
    );

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }
}
