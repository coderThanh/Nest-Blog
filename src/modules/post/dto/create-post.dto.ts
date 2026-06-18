import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  isNotEmpty,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { ValidateMessage } from '@/common/ultils';

export class CreatePostDto {
  /** @example "Tên bài viết" */
  @MaxLength(MAX_LENGTH_NAME, {
    message: ValidateMessage.maxLength(MAX_LENGTH_NAME).exceptionMsg(),
  })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  name: string;

  /** @example  "Nội dung bài viết"*/
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  content: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  thumbnailId?: string | null;
}
