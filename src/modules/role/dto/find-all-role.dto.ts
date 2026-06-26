import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { OrderDir } from '@/common/enum/filter.enum';
import { QUERY_SEPARATOR } from '@/common/constant/ultil';
import { RoleOrderBy } from '@/modules/role/role.enum';
import { SplitToArrayNumber } from '@/common/decorator/to-array';
import { ToBoolean } from '@/common/decorator/to-bool';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllRoleDto extends IntersectionType(
  FilterIdsStringDto,
  FilterSearchDto,
  FilterPaginationDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsEnum(RoleOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy: RoleOrderBy = RoleOrderBy.createdAt;

  @IsBoolean({
    message: ValidateMessage.isBoolean().exceptionMsg(),
  })
  @ToBoolean()
  @IsOptional()
  isSystem?: boolean;
}
