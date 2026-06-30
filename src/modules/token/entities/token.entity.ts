import { Expose, Type } from 'class-transformer';

import { TokenType } from '@prisma/client';
import { UserRelation } from '@/modules/user/entities/user.entity';

export class Token {
  @Expose()
  id: string;

  @Expose()
  type: TokenType;

  @Expose()
  token: string;

  @Expose()
  userId: string;

  @Expose()
  expiresAt: string;

  @Expose()
  createdAt: string;

  @Expose()
  @Type(() => UserRelation)
  user: UserRelation;
}
