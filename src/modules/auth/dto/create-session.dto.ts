import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateSessionDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  refreshtokenHash: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  userAgent: string | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  ipAddress: string | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  userId: string;

  @IsDateString(undefined, {
    message: ValidateMessage.isDateString().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  expiresAt: string;
}
