import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ValidateMessage } from '@/common/utils/validate-message.util';

export class LoginDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  username: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  password: string;
}
