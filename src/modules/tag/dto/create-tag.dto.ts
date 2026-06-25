import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateTagDto {
  /** @example 'tag' */
  @IsMaxLength()
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  name: string;

  /** @example 'tag' */
  @IsMaxLength()
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  slug: string;
}
