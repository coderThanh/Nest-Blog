import { Prisma } from '@prisma/client';

export class FileEntity {
  //
  public static selectRelation: Prisma.FileSelect = {
    id: true,
    path: true,
  };
}
