import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { COMMENT_MODELS } from '@/modules/comment/comment.const';
import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { MAX_LENGTH_COMMENT } from '@/common/constant/util';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { Prisma } from '@prisma/client';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { isNotNullOrUndefined as isNotNullAndUndefined } from '@/common/utils/helper.util';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Nội dung bình luận',
    maxLength: MAX_LENGTH_COMMENT,
  })
  @IsMaxLength(MAX_LENGTH_COMMENT)
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

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Id comment root. Required parentId if replyToId not null',
  })
  @ValidateIf((o: CreateCommentDto) => {
    return (
      isNotNullAndUndefined(o.replyToId) || isNotNullAndUndefined(o.parentId)
    );
  })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsNotEmpty({
    message: ValidateMessage.isNotEmpty().exceptionMsg(),
  })
  // @IsOptional()
  parentId?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  replyToId?: string | null;
}
