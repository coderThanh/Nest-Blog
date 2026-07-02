import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

import { COMMENT_MODELS } from '@/modules/comment/comment.const';
import { CommentOrderBy } from '@/modules/comment/comment.enum';
import { FilterCreatedByDto } from '@/shared/dto/filter-created-by.dto';
import { FilterCursorStringDto } from '@/shared/dto/filter-cursor.dto';
import { FilterLimitDto } from '@/shared/dto/filter-limit.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { IntersectionType } from '@nestjs/swagger';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { OrderDir } from '@/common/enum/filter.enum';
import { ToNullable } from '@/common/decorator/to-nullable.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllCommentDto extends IntersectionType(
  FilterCursorStringDto,
  FilterLimitDto,
  FilterCreatedByDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @ToNullable()
  @NormalizeString()
  @IsOptional()
  parentId?: string | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @ToNullable()
  @NormalizeString()
  @IsOptional()
  replyToId?: string | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @ToNullable()
  @NormalizeString()
  @IsOptional()
  targetId?: string;

  @IsIn([...COMMENT_MODELS], {
    message: ValidateMessage.isString().exceptionMsg(),
  })
  @NormalizeString()
  @IsOptional()
  targetType?: string;

  @IsEnum(CommentOrderBy, { message: ValidateMessage.isEnum().exceptionMsg() })
  @IsOptional()
  orderBy: CommentOrderBy = CommentOrderBy.createdAt;
}
