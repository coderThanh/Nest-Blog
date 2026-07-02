import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { FilterCreatedByDto } from '@/shared/dto/filter-created-by.dto';
import { FilterFromToDateDto } from '@/shared/dto/filter-from-to-date.dto';
import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { OrderDir } from '@/common/enum/filter.enum';
import { PostOrderBy } from '@/modules/post/post.enum';
import { QUERY_SEPARATOR } from '@/common/constant/util';
import { SplitToArrayNumber } from '@/common/decorator/to-array.decorator';
import { ToNullable } from '@/common/decorator/to-nullable.decorator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllPostDto extends IntersectionType(
  FilterIdsStringDto,
  FilterSearchDto,
  FilterCreatedByDto,
  FilterPaginationDto,
  PartialType(FilterFromToDateDto),
  FilterOrderDirDto(OrderDir.desc),
) {
  @ApiPropertyOptional({ type: String, description: 'ex: id,id' })
  @NormalizeString()
  @ToNullable()
  @SplitToArrayNumber(QUERY_SEPARATOR, true)
  @IsInt({ each: true, message: ValidateMessage.isArrayInt().exceptionMsg() })
  @IsOptional()
  categoryIds?: number[] | null;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  categoryPath?: string | null;

  @ApiPropertyOptional({ type: String, description: 'ex: id,id' })
  @NormalizeString()
  @ToNullable()
  @SplitToArrayNumber(QUERY_SEPARATOR, true)
  @IsString({
    each: true,
    message: ValidateMessage.isArrayString().exceptionMsg(),
  })
  @IsOptional()
  tagIds?: string[] | null;

  @IsEnum(PostOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy: PostOrderBy = PostOrderBy.createdAt;
}
