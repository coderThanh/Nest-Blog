import { PermissionAction } from '@/common/enum/role-permission.enum';

export class PermissionUtil {
  static generatePermissionCode(
    model: string,
    action: PermissionAction,
  ): string {
    return model + ':' + action;
  }

  static parsePermissionName(action: PermissionAction): string {
    switch (action) {
      case PermissionAction.read:
        return 'Đọc';
      case PermissionAction.create:
        return 'Tạo';
      case PermissionAction.update:
        return 'Chỉnh sửa';
      case PermissionAction.delete:
        return 'Xoá';
      case PermissionAction.approve:
        return 'Xét duyệt';

      default:
        return action;
    }
  }
}
