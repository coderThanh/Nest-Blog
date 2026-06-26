import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { FilterIdsStringDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum/filter.enum';
import { UserOrderBy } from '@/modules/user/user.enum';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllUserDto extends IntersectionType(
  FilterIdsStringDto,
  FilterSearchDto,
  FilterPaginationDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  roleId?: string;

  @IsEnum(UserOrderBy, { message: ValidateMessage.isEnum().exceptionMsg() })
  @IsOptional()
  orderBy: UserOrderBy = UserOrderBy.createdAt;
}
