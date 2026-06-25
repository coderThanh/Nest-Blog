import { IsEnum, IsOptional } from 'class-validator';

import { OrderDir } from '@/common/enum/filter.enum';
import { ValidateMessage } from '@/common/ultils/validate-message';

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
