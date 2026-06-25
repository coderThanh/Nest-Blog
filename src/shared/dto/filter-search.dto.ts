import { IsOptional, IsString } from 'class-validator';

import { NormalizeString } from '@/common/decorator/normalize-string';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class FilterSearchDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  search?: string;
}
