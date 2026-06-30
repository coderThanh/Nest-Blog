import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { IsStrongPassword } from 'class-validator';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { applyDecorators } from '@nestjs/common';

export function IsPassword() {
  return applyDecorators(
    IsStrongPassword(
      {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      },
      { message: ValidateMessage.isStrongPassword().exceptionMsg() },
    ),
    IsMaxLength(),
  );
}
