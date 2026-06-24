import {
  FilterIdsStringDto,
  FilterOrderDirDto,
  FilterPaginationDto,
  FilterSearchDto,
} from '@/shared/dto';
import { IsEnum, IsOptional } from 'class-validator';

import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum';
import { TagOrderBy } from '@/modules/tag/tag.enum';
import { ValidateMessage } from '@/common/ultils';

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
