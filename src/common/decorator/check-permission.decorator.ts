import { PermissionAction } from '@/common/enum/role-permission.enum';
import { PermissionUtil } from '@/common/utils/permission.util';
import { Prisma } from '@prisma/client';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { SetMetadata } from '@nestjs/common';

export const CheckPermission = (
  model: Prisma.ModelName,
  action: PermissionAction,
) =>
  SetMetadata(
    ReflectorEnum.checkPermission,
    PermissionUtil.generatePermissionCode(model, action),
  );
