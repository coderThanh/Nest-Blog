import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return (
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      request.ip
    );
  },
);

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.headers['user-agent'];
  },
);
