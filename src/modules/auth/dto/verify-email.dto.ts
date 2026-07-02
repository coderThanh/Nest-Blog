import { IsNotEmpty, IsString } from 'class-validator';

import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class VerifyEmailDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  token: string;
}
