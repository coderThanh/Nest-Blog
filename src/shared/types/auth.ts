import { PermissionScope } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  jti: string; // uuid
};

export type ReqUserEmbed = JwtPayload & {
  permissions: {
    permission: string;
    scope: PermissionScope;
  }[];
};
