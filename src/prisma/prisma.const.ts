import { Prisma } from '@prisma/client';

/**
 * Danh sách các model có hỗ trợ audit fields (createdBy, updatedBy, deletedBy)
 */
export const AUDIT_MODELS: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Category,
  Prisma.ModelName.Comment,
  Prisma.ModelName.File,
  Prisma.ModelName.Permission,
  Prisma.ModelName.Post,
  Prisma.ModelName.Role,
  Prisma.ModelName.Tag,
  Prisma.ModelName.User,
]);

/**
 * Danh sách các model có hỗ trợ status  RecordStatus
 */
export const STATUS_MODELS: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Post,
]);

export const MODELS_HAS_APPROVE: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Comment,
  Prisma.ModelName.Post,
]);

export const MODELS_NO_APPROVE: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Category,
  Prisma.ModelName.Comment,
  Prisma.ModelName.File,
  Prisma.ModelName.Permission,
  Prisma.ModelName.Post,
  Prisma.ModelName.Role,
  Prisma.ModelName.Tag,
  Prisma.ModelName.User,
]);

export const MODELS_HAS_ID_TYPE_INT: Set<Prisma.ModelName> = new Set([
  Prisma.ModelName.Category,
  Prisma.ModelName.Permission,
]);
