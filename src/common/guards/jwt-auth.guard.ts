import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { Reflector } from '@nestjs/core';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyType.jwt) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      ReflectorEnum.isPublic,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

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
