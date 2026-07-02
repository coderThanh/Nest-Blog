import { IsOptional, IsString } from 'class-validator';

import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { ToNullable } from '@/common/decorator/to-nullable.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterCreatedByDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @ToNullable()
  @NormalizeString()
  @IsOptional()
  createdBy?: string | null;
}
