import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  SplitToArray,
  SplitToArrayNumber,
} from '@/common/decorator/to-array.decorator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { QUERY_SEPARATOR } from '@/common/constant/util';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterIdsStringDto {
  @ApiPropertyOptional({
    type: String,
    description: `ex: id${QUERY_SEPARATOR}id`,
  })
  @IsString({
    each: true,
    message: ValidateMessage.isArrayString().exceptionMsg(),
  })
  @SplitToArray(QUERY_SEPARATOR)
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional({
    type: String,
    description: `ex: id${QUERY_SEPARATOR}id`,
  })
  @IsString({
    each: true,
    message: ValidateMessage.isArrayString().exceptionMsg(),
  })
  @SplitToArray(QUERY_SEPARATOR)
  @IsOptional()
  excludeIds?: string[];
}

export class FilterIdsIntDto {
  @ApiPropertyOptional({
    type: String,
    description: `ex: id${QUERY_SEPARATOR}id`,
  })
  @IsInt({
    each: true,
    message: ValidateMessage.isArrayInt().exceptionMsg(),
  })
  @SplitToArrayNumber(QUERY_SEPARATOR, false)
  @IsOptional()
  ids?: number[];

  @ApiPropertyOptional({
    type: String,
    description: `ex: id${QUERY_SEPARATOR}id`,
  })
  @IsInt({
    each: true,
    message: ValidateMessage.isArrayInt().exceptionMsg(),
  })
  @SplitToArrayNumber(QUERY_SEPARATOR, false)
  @IsOptional()
  excludeIds?: number[];
}
