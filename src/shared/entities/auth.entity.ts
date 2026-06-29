import { PermissionScope } from '@prisma/client';

export class JwtPayload {
  sub: string;
  userId: string;
  email: string;
  jti: string; // uuid

  constructor(partial: JwtPayload) {
    Object.assign(this, partial);
  }
}

export class PermissionEmbed {
  permission: string;
  scope: PermissionScope;

  constructor(partial: PermissionEmbed) {
    Object.assign(this, partial);
  }
}

export class ReqUserEmbed extends JwtPayload {
  permissions: PermissionEmbed[];

  constructor(partial: ReqUserEmbed) {
    super(partial);
    Object.assign(this, partial);
  }
}
