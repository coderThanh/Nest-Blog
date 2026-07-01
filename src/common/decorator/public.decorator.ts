import { SetMetadata } from '@nestjs/common';
import { ReflectorEnum } from '@/common/enum/reflector.enum';

export const Public = () => SetMetadata(ReflectorEnum.isPublic, true);
