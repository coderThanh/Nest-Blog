import { IsEnum, IsOptional } from 'class-validator';

import { OrderDir } from '@/common/enum';
import { ValidateMessage } from '@/common/ultils';

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
