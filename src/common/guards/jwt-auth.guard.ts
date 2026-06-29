import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyType.jwt) {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // Nếu có lỗi hoặc không có user (JWT không hợp lệ, hết hạn, v.v...)
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(ValidateMessage.unauthorized().rawMsg())
      );
    }

    return user;
  }
}
