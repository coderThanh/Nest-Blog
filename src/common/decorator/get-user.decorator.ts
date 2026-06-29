import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload, ReqUserEmbed } from '@/shared/entities/auth.entity';

export const GetUser = createParamDecorator(
  (field: keyof ReqUserEmbed | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user: ReqUserEmbed | undefined = request.user;

    if (field) {
      return user ? user[field] : undefined;
    }

    return user as ReqUserEmbed;
  },
);

export const GetUserLocalStrategy = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user: JwtPayload | undefined = request.user;

    if (field) {
      return user ? user[field] : undefined;
    }

    return user as JwtPayload;
  },
);
