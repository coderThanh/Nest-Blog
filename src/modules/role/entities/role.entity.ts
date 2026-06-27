import { Expose, Transform, Type } from 'class-transformer';
import { PermissionScope, Prisma, RolePermission } from '@prisma/client';

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
  @Transform(({ obj }: { obj: Role }) => {
    if (obj.permissions === undefined) return null;

    return (obj.permissions as any).map(
      (item) => new PermissionInRole(item.permission.permission, item.scope),
    );
  })
  permissions: PermissionInRole[];

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

  static selectRelationEmbedPermission: Prisma.RoleSelect = {
    id: true,
    name: true,
    permissions: {
      select: {
        scope: true,
        permission: {
          select: {
            permission: true,
          },
        },
      },
    },
  };
}

export class PermissionInRole {
  @Expose()
  permission: string;

  @Expose()
  scope: PermissionScope;

  constructor(permission: string, scope: PermissionScope) {
    this.permission = permission;
    this.scope = scope;
  }
}
