import { Prisma } from '@prisma/client';

export enum CategoryOrderBy {
  name = 'name',
  parentId = 'parentId',
  createdBy = 'createdBy',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}
