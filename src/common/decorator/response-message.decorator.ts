import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) =>
  SetMetadata(ReflectorEnum.responseMessage, message);
