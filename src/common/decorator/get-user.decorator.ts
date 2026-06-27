import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { ReqUserEmbed } from '@/shared/types/auth';

export const GetUser = createParamDecorator(
  (field: keyof ReqUserEmbed | undefined, ctx: ExecutionContext) => {
    const requet = ctx.switchToHttp().getRequest();

    const user: ReqUserEmbed | undefined = requet.user;

    if (field && user) {
      return user[field];
    }

    return user;
  },
);
