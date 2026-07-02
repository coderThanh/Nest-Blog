import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum/filter.enum';
import { RoleOrderBy } from '@/modules/role/role.enum';
import { ToBoolean } from '@/common/decorator/to-bool.decorator';
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
