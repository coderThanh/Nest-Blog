import { IsNotEmpty, IsString } from 'class-validator';

import { IsPassword } from '@/common/decorator/is-strong-password.decorator';
import { IsRepeat } from '@/common/decorator/is-repeat.decorrator';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class ResetPasswordDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  token: string;

  @IsPassword()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  password: string;

  @IsRepeat('password', {
    message: ValidateMessage.isRepeatMatch().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  repeatPassword: string;
}
