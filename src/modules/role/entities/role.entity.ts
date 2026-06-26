import { Prisma, RolePermission } from '@prisma/client';

import { Expose } from 'class-transformer';
import { UserRelation } from '@/modules/user/entities/user.entity';

export class Role {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  isSystem: boolean;

  @Expose()
  permissions: RolePermission[];

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: UserRelation | null;

  //
  static selectRelation: Prisma.RoleSelect = {
    id: true,
    name: true,
  };

  static selectFindAll: Prisma.RoleSelect = {
    id: true,
    name: true,
    isSystem: true,
    description: true,
    createdAt: true,
    createdBy: true,
    createdByUser: {
      select: {
        id: true,
        name: true,
        thumbnailId: true,
        thumbnal: { select: { id: true, path: true } },
      },
    },
    updatedAt: true,
  };
}
