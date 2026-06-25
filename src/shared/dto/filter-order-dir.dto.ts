import { IsEnum, IsOptional } from 'class-validator';

import { OrderDir } from '@/common/enum/filter.enum';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export function FilterOrderDirDto(defaultField: OrderDir) {
  class MixinOrderDto {
    @IsEnum(OrderDir, {
      message: ValidateMessage.isEnum().exceptionMsg(),
    })
    @IsOptional()
    orderDir: OrderDir = defaultField;
  }
  return MixinOrderDto;
}
