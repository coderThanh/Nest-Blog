import { IsInt, IsOptional, Max } from 'class-validator';
import {
  PAGINATION_LIMIT_DEFAULT,
  PAGINATION_LIMIT_MAX,
} from '@/common/constant/ultil';

import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/ultils';

export class FilterPaginationDto {
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @Max(PAGINATION_LIMIT_MAX, {
    message: ValidateMessage.max(PAGINATION_LIMIT_MAX).exceptionMsg(),
  })
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  limit?: number = PAGINATION_LIMIT_DEFAULT;
}
