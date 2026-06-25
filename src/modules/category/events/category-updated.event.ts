import { IsInt, IsOptional, IsString } from 'class-validator';

import { Prisma } from '@prisma/client';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class CategoryUpdatedEvent {
  @IsInt({ message: ValidateMessage.isInt().rawMsg() })
  categoryId: number;

  @IsInt({ message: ValidateMessage.isInt().rawMsg() })
  @IsOptional()
  newParentId: number | null;

  @IsInt({ message: ValidateMessage.isInt().rawMsg() })
  @IsOptional()
  oldParentId: number | null;

  @IsString({ message: ValidateMessage.isString().rawMsg() })
  @IsOptional()
  oldPath: string | null;

  tx: Prisma.TransactionClient;

  constructor(params: CategoryUpdatedEvent) {
    Object.assign(this, params);
  }
}
