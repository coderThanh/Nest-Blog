import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PermissionScope } from '@prisma/client';
import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class UpdateRolePermissionItemDto {
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  permissionId: number;

  @IsEnum(PermissionScope, { message: ValidateMessage.isInt().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  scope: PermissionScope;
}

export class UpdateRolePermissionDto {
  @ApiProperty({
    type: [UpdateRolePermissionItemDto],
    description: 'Danh sách các quyền hạn',
  })
  @IsArray({ message: ValidateMessage.isArray().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  @ValidateNested({ each: true })
  @Type(() => UpdateRolePermissionItemDto)
  items: UpdateRolePermissionItemDto[];
}
