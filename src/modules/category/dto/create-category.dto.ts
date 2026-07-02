import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  NormalizeString,
  ToLowerCaseAndTrim,
} from '@/common/decorator/normalize-string.decorator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { MAX_LENGTH_NAME } from '@/common/constant/util';
import { ToNumber } from '@/common/decorator/to-number.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateCategoryDto {
  /** @example 'Danh mục bài viết'*/
  @IsMaxLength()
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  name: string;

  @IsMaxLength()
  @ToLowerCaseAndTrim()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  slug: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  thumbnailId?: string | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsInt({
    message: ValidateMessage.isArrayNumber().exceptionMsg(),
  })
  @ToNumber()
  @IsOptional()
  parentId?: number | null;
}
