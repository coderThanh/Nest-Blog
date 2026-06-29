import { IsNotEmpty, IsString } from 'class-validator';

import { NormalizeString } from '@/common/decorator/normalize-string';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class RefreshTokenDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  refreshToken: string;
}
