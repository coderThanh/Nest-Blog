import { Prisma } from '@prisma/client';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { SetMetadata } from '@nestjs/common';

export const CheckAuthor = (model: Prisma.ModelName) =>
  SetMetadata(ReflectorEnum.checkAuthor, model);
