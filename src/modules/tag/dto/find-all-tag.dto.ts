import { IsEnum, IsOptional } from 'class-validator';

import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum/filter.enum';
import { TagOrderBy } from '@/modules/tag/tag.enum';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class FindAllTagDto extends IntersectionType(
  FilterSearchDto,
  FilterPaginationDto,
  FilterIdsStringDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsEnum(TagOrderBy, { message: ValidateMessage.isEnum().exceptionMsg() })
  @IsOptional()
  orderBy: TagOrderBy = TagOrderBy.createdAt;
}
