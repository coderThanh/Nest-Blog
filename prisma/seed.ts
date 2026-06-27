import * as dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { seedPermission } from './seeds/permission.seed.';
import { seedRole } from './seeds/role.seed';
import { seedRolePermission } from 'prisma/seeds/role-permission.seed';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error('env DATABASE_URL is empty');
const pool = new pg.Pool({ connectionString: connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(async (ctx) => {
    console.info('Start seeding...');
    await seedRole(ctx as any);
    await seedPermission(ctx as any);
    await seedRolePermission(ctx as any);
    console.info('End seeding...');
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
