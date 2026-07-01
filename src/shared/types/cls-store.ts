import { ClsStore } from 'nestjs-cls';
import { PermissionScope } from '@prisma/client';

export interface GlobalClsStore extends ClsStore {
  userId?: string;
  permissionScope?: PermissionScope;
}
