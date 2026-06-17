import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

jest.mock('../generated/prisma/client', () => {
  class PrismaClientMock {
    constructor() {}

    $connect = jest.fn();
    $disconnect = jest.fn();
  }

  return { PrismaClient: PrismaClientMock };
});

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('pg', () => ({
  __esModule: true,
  default: {
    Pool: jest.fn().mockImplementation(() => ({})),
  },
}));

describe('PrismaService', () => {
  let service: PrismaService;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(() => {
    process.env.DATABASE_URL ??=
      'postgresql://root:password@localhost:5435/blog?schema=public';
  });

  afterAll(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
      return;
    }

    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
