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
} from '@/common/decorator/normalize-string';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { ToNumber } from '@/common/decorator';
import { ValidateMessage } from '@/common/ultils';

export class CreateCategoryDto {
  /** @example 'Danh mục bài viết'*/
  @MaxLength(MAX_LENGTH_NAME, {
    message: ValidateMessage.maxLength(MAX_LENGTH_NAME).exceptionMsg(),
  })
  @NormalizeString()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  name: string;

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
