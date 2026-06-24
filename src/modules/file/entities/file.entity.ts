import { Expose, Type } from 'class-transformer';

import { Prisma } from '@prisma/client';
import { UserRelation } from '@/modules/user/entities/user.entity';

export class FileEntity {
  @Expose()
  createdByUser: UserRelation | null;

  //
  public static selectRelation: Prisma.FileSelect = {
    id: true,
    path: true,
  };
}
