import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { COMMENT_MODELS } from '@/modules/comment/comment.const';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { Prisma } from '@prisma/client';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateCommentDto {
  /** @example 'Nội dung bình luận'*/
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  content: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  targetId: string;

  @ApiProperty({ example: Prisma.ModelName.Post })
  @IsIn([...COMMENT_MODELS], {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isRequired().exceptionMsg() })
  targetType: Prisma.ModelName;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  parentId?: string | null;
}
