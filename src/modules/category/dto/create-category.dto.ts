import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { ToNumber } from '@/common/decorator/to-number';
import {
  NormalizeString,
  ToLowerCaseAndTrim,
} from '@/common/decorator/normalize-string';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { ValidateMessage } from '@/common/ultils/validate-message';

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
