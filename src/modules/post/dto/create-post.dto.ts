import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  isNotEmpty,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { ToNumber } from '@/common/decorator';
import { ValidateMessage } from '@/common/ultils';

export class CreatePostDto {
  /** @example "Tên bài viết" */
  @MaxLength(MAX_LENGTH_NAME, {
    message: ValidateMessage.maxLength(MAX_LENGTH_NAME).exceptionMsg(),
  })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  name: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  slug: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  thumbnailId?: string | null;

  /** @example  "Nội dung bài viết"*/
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  content: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  shortDescription?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsInt({
    message: ValidateMessage.isArrayNumber().exceptionMsg(),
    each: true,
  })
  @ToNumber({ each: true })
  @IsOptional()
  categoryIds?: number[] | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({
    message: ValidateMessage.isArrayString().exceptionMsg(),
    each: true,
  })
  @IsOptional()
  tagIds?: string[] | null;
}
