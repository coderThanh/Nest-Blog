import { IsInt, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ToNumber } from '@/common/decorator/to-number.decorator';
import { Type } from 'class-transformer';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterCursorStringDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  lastCursor?: string;
}

export class FilterCursorIntDto {
  @ApiPropertyOptional({ type: String })
  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @ToNumber()
  @IsOptional()
  lastCursor?: number;
}
