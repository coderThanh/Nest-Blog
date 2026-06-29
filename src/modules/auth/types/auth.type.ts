import { JwtPayload } from '@/shared/entities/auth.entity';

export type LoginRequestInfo = {
  ipAddress?: string;
  userAgent?: string;
};

export type JwtDecodedPayload = JwtPayload & {
  iat: number;
  exp: number;
};
