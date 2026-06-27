import { PrismaClient } from '@prisma/client';

export const SEED_ROLE_IDS = {
  ADMIN: 'clv1j8y6m000008l2h000001',
  MEMBER: 'clv1j8y6m000008l2h000002',
};

export async function seedRole(prisma: PrismaClient) {
  console.info('Start seeding Role...');
  await Promise.all([
    prisma.role.upsert({
      where: { id: SEED_ROLE_IDS.ADMIN },
      create: { id: SEED_ROLE_IDS.ADMIN, name: 'admin', isSystem: true },
      update: {},
    }),

    prisma.role.upsert({
      where: { id: SEED_ROLE_IDS.MEMBER },
      create: { id: SEED_ROLE_IDS.MEMBER, name: 'user', isSystem: true },
      update: {},
    }),
  ]);
  console.info('End seeding Role...');
}
