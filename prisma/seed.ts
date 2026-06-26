import * as dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { seedRole } from './seeds/role.seed';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('connectionString is empty');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(async (ctx) => {
    console.info('Start seeding...');
    await seedRole(ctx as any);
    console.info('End seeding...');
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
