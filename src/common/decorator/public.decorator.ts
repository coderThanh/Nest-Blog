import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(ReflectorEnum.isPublic, true);
