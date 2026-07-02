import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { CategoryOrderBy } from '@/modules/category/category.enum';
import { FilterIdsIntDto } from '@/shared/dto/filter-ids.dto';
import { FilterOrderDirDto } from '@/shared/dto/filter-order-dir.dto';
import { FilterPaginationDto } from '@/shared/dto/filter-pagination.dto';
import { FilterSearchDto } from '@/shared/dto/filter-search.dto';
import { NormalizeString } from '@/common/decorator/normalize-string.decorator';
import { OrderDir } from '@/common/enum/filter.enum';
import { ToNullable } from '@/common/decorator/to-nullable.decorator';
import { ToNumber } from '@/common/decorator/to-number.decorator';
import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FindAllCategoryDto extends IntersectionType(
  FilterSearchDto,
  FilterPaginationDto,
  FilterIdsIntDto,
  FilterOrderDirDto(OrderDir.desc),
) {
  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  @ToNullable()
  @ToNumber()
  @NormalizeString()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @IsOptional()
  parentId?: number | null;

  @IsEnum(CategoryOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy: CategoryOrderBy = CategoryOrderBy.createdAt;
}
