import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { LoginDto } from '@/modules/auth/dto/login.dto';

import { v7 as uuidv7 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { LoginToken } from '@/modules/auth/entities/logic-token.entity';
import { ApiCustomResponseOK } from '@/common/decorator/api-response-ok.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiCustomResponseOK(LoginToken)
  async login(@Body() body: LoginDto, @GetUser() userReq: JwtPayload) {
    const tokens = await this.authService.generateTokens(userReq);

    return plainToInstance(LoginToken, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
