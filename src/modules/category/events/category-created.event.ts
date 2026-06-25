import { IsInt, IsOptional } from 'class-validator';

import { Prisma } from '@prisma/client';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CategoryCreatedEvent {
  @IsInt({ message: ValidateMessage.isInt().rawMsg() })
  categoryId: number;

  @IsInt({ message: ValidateMessage.isInt().rawMsg() })
  @IsOptional()
  parentId: number | null;

  tx: any;

  constructor(params: CategoryCreatedEvent) {
    Object.assign(this, params);
  }
}
