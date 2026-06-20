import { IsEnum, IsOptional } from 'class-validator';

import { OrderDir } from '@/common/enum';
import { ValidateMessage } from '@/common/ultils';

export function FilterOrderDirDto(defaultField: OrderDir) {
  class MixinOrderDto {
    @IsOptional()
    @IsEnum(OrderDir, {
      message: ValidateMessage.isEnum().exceptionMsg(),
    })
    orderDir?: OrderDir = defaultField;
  }
  return MixinOrderDto;
}
