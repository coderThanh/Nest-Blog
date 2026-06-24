import {
  FilterIdsDtoInt,
  FilterOrderDirDto,
  FilterPaginationDto,
} from '@/shared/dto';

import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum';

export class FindAllPostDto extends IntersectionType(
  FilterIdsDtoInt,
  FilterPaginationDto,
  FilterOrderDirDto(OrderDir.desc),
) {}
