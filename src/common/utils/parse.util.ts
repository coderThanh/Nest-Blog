import { Prisma } from '@prisma/client';

export function parseModelName(model: Prisma.ModelName): string {
  switch (model) {
    case 'User':
      return 'Người dùng';
    case 'Post':
      return 'Bài viết';
    case 'Category':
      return 'Danh mục';
    case 'Tag':
      return 'Thẻ';
    case 'File':
      return 'Tệp tin';
    case 'Role':
      return 'Vai trò';
    case 'Permission':
      return 'Quyền hạn';
    case 'RolePermission':
      return 'Quyền hạn vai trò';
    default:
      return model;
  }
}
