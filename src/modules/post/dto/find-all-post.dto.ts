import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { FilterFromToDateDto } from '@/shared/dto/filter-from-to-date';
import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { OrderDir } from '@/common/enum/filter.enum';
import { PostOrderBy } from '@/modules/post/post.enum';
import { QUERY_SEPARATOR } from '@/common/constant/util';
import { SplitToArrayNumber } from '@/common/decorator/to-array';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllPostDto extends IntersectionType(
  FilterIdsStringDto,
  FilterSearchDto,
  FilterPaginationDto,
  PartialType(FilterFromToDateDto),
  FilterOrderDirDto(OrderDir.desc),
) {
  @ApiPropertyOptional({ type: String, description: 'ex: id,id' })
  @IsInt({ each: true, message: ValidateMessage.isArrayInt().exceptionMsg() })
  @SplitToArrayNumber(QUERY_SEPARATOR, true)
  @IsOptional()
  categoryIds?: number[];

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  categoryPath?: string;

  @IsEnum(PostOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy: PostOrderBy = PostOrderBy.createdAt;
}
