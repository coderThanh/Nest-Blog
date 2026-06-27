import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  PAGINATION_LIMIT_DEFAULT,
  PAGINATION_LIMIT_MAX,
} from '@/common/constant/util';

import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterPaginationDto {
  @Min(1, { message: ValidateMessage.min(1).exceptionMsg() })
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @Min(1, { message: ValidateMessage.min(1).exceptionMsg() })
  @Max(PAGINATION_LIMIT_MAX, {
    message: ValidateMessage.max(PAGINATION_LIMIT_MAX).exceptionMsg(),
  })
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  limit: number = PAGINATION_LIMIT_DEFAULT;
}
