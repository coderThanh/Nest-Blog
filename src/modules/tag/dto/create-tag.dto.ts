import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { ValidateMessage } from '@/common/ultils';

export class CreateTagDto {
  /** @example 'tag' */
  @MaxLength(MAX_LENGTH_NAME, {
    message: ValidateMessage.maxLength(MAX_LENGTH_NAME).exceptionMsg(),
  })
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  name: string;

  /** @example 'tag' */
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  slug: string;
}
