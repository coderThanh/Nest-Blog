import {
  FilterIdsIntDto,
  FilterOrderDirDto,
  FilterPaginationDto,
} from '@/shared/dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { CategoryOrderBy } from '@/modules/category/category.enum';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { IntersectionType } from '@nestjs/swagger';
import { NormalizeString } from '@/common/decorator/normalize-string';
import { OrderDir } from '@/common/enum';
import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/ultils';

export class FindAllCategoryDto extends IntersectionType(
  FilterSearchDto,
  FilterPaginationDto,
  FilterIdsIntDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  parentId?: number;

  @IsEnum(CategoryOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy: CategoryOrderBy = CategoryOrderBy.createdAt;
}
