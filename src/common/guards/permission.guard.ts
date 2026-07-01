import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { ReqUserEmbed } from '@/shared/entities/auth.entity';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(
      ReflectorEnum.checkPermission,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user: ReqUserEmbed | undefined = request.user as ReqUserEmbed;

    if (!user || !user.permissions.length) return false;

    const permissionInRole = user.permissions.find(
      (item) => item.permission === permission,
    );

    console.log(permissionInRole);
    return permissionInRole ? true : false;
  }
}
