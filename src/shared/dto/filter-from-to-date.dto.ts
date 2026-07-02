import { IsDateString, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class FilterFromToDateDto {
  @ApiProperty({
    description: 'ex: 2026-06-01',
  })
  @IsDateString(undefined, {
    message: ValidateMessage.isDateString().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  fromDate: string;

  @ApiProperty({
    description: 'ex: 2026-06-30',
  })
  @IsDateString(undefined, {
    message: ValidateMessage.isDateString().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  toDate: string;
}
