import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { ClsService } from 'nestjs-cls';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { ReqUserEmbed } from '@/shared/entities/auth.entity';
import { Request } from 'express';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<GlobalClsStore>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissionRequire = this.reflector.getAllAndOverride<string>(
      ReflectorEnum.checkPermission,
      [context.getHandler(), context.getClass()],
    );

    if (!permissionRequire) return true;

    // section
    const request = context.switchToHttp().getRequest<Request>();
    const user: ReqUserEmbed | undefined = request.user as ReqUserEmbed;

    if (!user || !user.permissions.length) {
      throw new ForbiddenException(ValidateMessage.forbidden().rawMsg());
    }

    const permissionInRole = user.permissions.find(
      (item) => item.permission === permissionRequire,
    );

    if (!permissionInRole) {
      throw new ForbiddenException(ValidateMessage.forbidden().rawMsg());
    }

    if (permissionInRole?.scope) {
      this.cls.set('permissionScope', permissionInRole.scope);
    }

    return true;
  }
}
