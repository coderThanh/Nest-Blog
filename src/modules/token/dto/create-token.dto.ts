import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { TokenType } from '@prisma/client';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateTokenDto {
  @IsEnum(TokenType, { message: ValidateMessage.isEnum().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  type: TokenType;

  @IsDateString(undefined, {
    message: ValidateMessage.isDateString().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  expiresAt: string;

  @IsString({
    message: ValidateMessage.isString().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  userId: string;
}
