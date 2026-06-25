import { Prisma } from '@prisma/client';

// Chỉ bao gồm các model thực tế có trong schema
const SOFT_DELETE_MODELS: Set<Prisma.ModelName> = new Set(['User']);

/**
 * Helper để thêm điều kiện deletedAt: null vào tham số where
 */
const addSoftDeleteWhere = <T extends { where?: any }>(args: T) => {
  args.where = {
    ...args.where,
    deletedAt: null,
  };
  return args;
};

/**
 * Prisma Extension cho Soft Delete
 * Chuyển đổi lệnh delete thành update deletedAt và lọc record trong find queries
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    $allModels: {
      // --- TRUY VẤN (FIND) ---
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async findFirst({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async findFirstOrThrow({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async findUnique({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async findUniqueOrThrow({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      // --- TỔNG HỢP (AGGREGATE) ---
      async count({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async aggregate({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async groupBy({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      // --- CẬP NHẬT (UPDATE) ---
      async update({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async updateMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) addSoftDeleteWhere(args);
        return query(args);
      },

      async upsert({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          // Đảm bảo không update record đã bị soft delete
          addSoftDeleteWhere(args);
        }
        return query(args);
      },
    },
  },
});
