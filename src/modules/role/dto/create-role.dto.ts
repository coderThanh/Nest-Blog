import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateRoleDto {
  @IsMaxLength()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  name: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  description?: string | null;
}
