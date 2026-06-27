import { PermissionScope, PrismaClient } from '@prisma/client';

import { PermissionAction } from '@/common/enum/role-permission.enum';
import { SEED_ROLE_IDS } from 'prisma/seeds/role.seed';

//
export async function seedRolePermission(prisma: PrismaClient) {
  console.info('Start seeding RolePermission...');

  const permissionAll = await prisma.permission.findMany({
    select: { id: true },
  });

  await prisma.role.update({
    where: { id: SEED_ROLE_IDS.ADMIN },
    data: {
      permissions: {
        deleteMany: {},
        create: permissionAll.map((item) => ({
          permissionId: item.id,
          scope: PermissionScope.SYSTEM,
        })),
      },
    },
  });

  const permissionReadAll = await prisma.permission.findMany({
    where: { permission: { endsWith: PermissionAction.read } },
    select: { id: true },
  });

  await prisma.role.update({
    where: { id: SEED_ROLE_IDS.MEMBER },
    data: {
      permissions: {
        deleteMany: {},
        create: permissionReadAll.map((item) => ({
          permissionId: item.id,
          scope: PermissionScope.OWN,
        })),
      },
    },
  });

  console.info('End seeding RolePermission...');
}
