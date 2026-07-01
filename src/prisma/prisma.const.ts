import { Prisma } from '@prisma/client';

/**
 * Danh sách các model có hỗ trợ audit fields (createdBy, updatedBy, deletedBy)
 */
export const AUDIT_MODELS: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.User,
  Prisma.ModelName.Category,
  Prisma.ModelName.Post,
  Prisma.ModelName.Tag,
  Prisma.ModelName.File,
  Prisma.ModelName.Role,
  Prisma.ModelName.Permission,
]);

/**
 * Danh sách các model có hỗ trợ status  RecordStatus
 */
export const STATUS_MODELS: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Post,
]);
