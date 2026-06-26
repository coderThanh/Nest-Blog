import { ClsService } from 'nestjs-cls';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { Prisma } from '@prisma/client';

/**
 * Danh sách các model có hỗ trợ audit fields (createdBy, updatedBy, deletedBy)
 */
const AUDIT_MODELS: Set<Prisma.ModelName> = new Set([
  'User',
  'Category',
  'Post',
  'Tag',
  'File',
  'Role',
  'Permission',
]);

/**
 * Prisma Extension để tự động thêm thông tin audit từ CLS (userId)
 */
export const auditExtension = (cls: ClsService<GlobalClsStore>) =>
  Prisma.defineExtension({
    name: 'audit',
    query: {
      $allModels: {
        // --- TẠO MỚI (CREATE) ---
        async create({ model, args, query }) {
          if (AUDIT_MODELS.has(model as Prisma.ModelName)) {
            const userId = cls.get('userId');
            if (userId) {
              args.data = {
                ...(args.data as any),
                createdBy: userId,
              };
            }
          }
          return query(args);
        },

        async createMany({ model, args, query }) {
          if (AUDIT_MODELS.has(model as Prisma.ModelName)) {
            const userId = cls.get('userId');
            if (userId) {
              if (Array.isArray(args.data)) {
                args.data = args.data.map((item) => ({
                  ...item,
                  createdBy: userId,
                }));
              } else {
                (args.data as any).createdBy = userId;
              }
            }
          }
          return query(args);
        },

        // --- CẬP NHẬT (UPDATE) ---
        // async update({ model, args, query }) {
        //   if (AUDIT_MODELS.has(model as Prisma.ModelName)) {
        //     const userId = cls.get('userId');
        //     if (userId) {
        //       // Tự động thêm updatedBy nếu schema hỗ trợ (hiện tại chưa có)
        //     }
        //   }
        //   return query(args);
        // },

        async upsert({ model, args, query }) {
          if (AUDIT_MODELS.has(model as Prisma.ModelName)) {
            const userId = cls.get('userId');
            if (userId) {
              args.create = {
                ...(args.create as any),
                createdBy: userId,
              };
              args.update = {
                ...(args.update as any),
                // updatedBy: userId,
              };
            }
          }
          return query(args);
        },
      },
    },
  });
