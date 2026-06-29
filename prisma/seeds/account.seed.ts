import { CryptoUtil } from '@/common/utils/crypto.util';
import { PrismaClient } from '@prisma/client';

const adminId = 'c000001';

export const seedAccount = async (ctx: PrismaClient) => {
  const passwordHash = await CryptoUtil.hash('Admin@123');
  console.info('Start seed account...');

  await ctx.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      phone: null,
      thumbnailId: null,
      name: 'Admin',
      email: 'example@gmail.com',
      username: 'admin',
      roleId: 'clv1j8y6m000008l2h000001',
      dob: '2000-06-25T07:41:05.871Z',
      gender: 'MALE',
      passwordHash: passwordHash,
    },
  });

  console.info('End seed account...');
};
