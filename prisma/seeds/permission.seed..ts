import { Prisma, PrismaClient } from '@prisma/client';

import { PermissionAction } from '@/common/enum/role-permission.enum';
import { PermissionUtil } from '@/common/utils/permission.util';
import { parseModelName } from '@/common/utils/parse.util';

const MODELS_HAS_APPROVE: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Post,
]);

const MODELS_NO_APPROVE: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Category,
  Prisma.ModelName.File,
  Prisma.ModelName.Permission,
  Prisma.ModelName.Post,
  Prisma.ModelName.Role,
  Prisma.ModelName.Tag,
  Prisma.ModelName.User,
]);

export async function seedPermission(prisma: PrismaClient) {
  console.info('Start seed permisson...');
  await Promise.all([
    upsertPermission(prisma, MODELS_HAS_APPROVE, true),
    upsertPermission(prisma, MODELS_NO_APPROVE, false),
  ]);
  console.info('End seed permisson...');
}

async function upsertPermission(
  prisma: PrismaClient,
  models: Set<Prisma.ModelName>,
  hasApprove: boolean,
) {
  const actions = Object.values(PermissionAction);

  for (const model of models) {
    for (const action of actions) {
      if (!hasApprove && action === PermissionAction.approve) continue;

      const permissionCode = PermissionUtil.generatePermissionCode(
        model,
        action,
      );

      await prisma.permission.upsert({
        where: { permission: permissionCode },
        create: {
          name: PermissionUtil.parsePermissionName(action),
          permission: permissionCode,
          module: parseModelName(model),
        },
        update: {},
      });
    }
  }
}
