import { IsNotEmpty, IsString } from 'class-validator';

import { IsPassword } from '@/common/decorator/is-strong-password.decorator';
import { IsRepeat } from '@/common/decorator/is-repeat.decorrator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class UpdatePasswordDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  oldPassword: string;

  @IsPassword()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  newPassword: string;

  @IsRepeat('newPassword', {
    message: ValidateMessage.isRepeatMatch().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  repeatNewPassword: string;
}
