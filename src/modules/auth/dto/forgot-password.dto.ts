import { IsEmail, IsNotEmpty } from 'class-validator';

import { ToLowerCaseAndTrim } from '@/common/decorator/normalize-string.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class ForgotPasswordDto {
  @IsEmail(undefined, { message: ValidateMessage.isEmail().exceptionMsg() })
  @ToLowerCaseAndTrim()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  email: string;
}
