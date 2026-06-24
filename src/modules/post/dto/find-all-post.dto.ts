import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  FilterIdsStringDto,
  FilterOrderDirDto,
  FilterPaginationDto,
} from '@/shared/dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { OrderDir } from '@/common/enum';
import { PostOrderBy } from '@/modules/post/post.enum';
import { QUERY_SEPARATOR } from '@/common/constant/ultil';
import { SplitToArrayNumber } from '@/common/decorator';
import { ValidateMessage } from '@/common/ultils';

export class FindAllPostDto extends IntersectionType(
  FilterIdsStringDto,
  FilterSearchDto,
  FilterPaginationDto,
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
