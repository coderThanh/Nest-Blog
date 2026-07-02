import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  PAGINATION_LIMIT_DEFAULT,
  PAGINATION_LIMIT_MAX,
} from '@/common/constant/util';

import { ToNumber } from '@/common/decorator/to-number.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterLimitDto {
  @Min(1, { message: ValidateMessage.min(1).exceptionMsg() })
  @Max(PAGINATION_LIMIT_MAX, {
    message: ValidateMessage.max(PAGINATION_LIMIT_MAX).exceptionMsg(),
  })
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @ToNumber()
  @IsOptional()
  limit: number = PAGINATION_LIMIT_DEFAULT;
}
