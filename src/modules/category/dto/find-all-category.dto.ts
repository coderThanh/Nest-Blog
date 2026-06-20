import {
  FilterIdsDtoInt,
  FilterOrderDirDto,
  FilterPaginationDto,
} from '@/shared/dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { CategoryOrderBy } from '@/modules/category/category.enum';
import { IntersectionType } from '@nestjs/swagger';
import { OrderDir } from '@/common/enum';
import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/ultils';

export class FindAllCategoryDto extends IntersectionType(
  FilterPaginationDto,
  FilterIdsDtoInt,
  FilterOrderDirDto(OrderDir.desc),
) {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  search?: string;

  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @Type(() => Number)
  @IsOptional()
  parentId?: number;

  @IsEnum(CategoryOrderBy, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  orderBy?: CategoryOrderBy = CategoryOrderBy.createdAt;
}
