import { PrismaClient } from '@prisma/client';

export const SEED_ROLE_IDS = {
  ADMIN: 'clv1j8y6m000008l2h000001',
  USER: 'clv1j8y6m000008l2h000002',
};

export async function seedRole(prisma: PrismaClient) {
  await prisma.role.upsert({
    where: { id: SEED_ROLE_IDS.ADMIN },
    create: { id: SEED_ROLE_IDS.ADMIN, name: 'admin', isSystem: true },
    update: {},
  });

  await prisma.role.upsert({
    where: { id: SEED_ROLE_IDS.USER },
    create: { id: SEED_ROLE_IDS.USER, name: 'user', isSystem: true },
    update: {},
  });
}
