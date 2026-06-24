import { Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { UserRelation } from '@/modules/user/entities/user.entity';

export class Tag {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  search: string | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: UserRelation | null;

  public static selectRelation: Prisma.TagSelect = {
    id: true,
    name: true,
    slug: true,
  };

  public static selectFindAll: Prisma.TagSelect = {
    id: true,
    name: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  };
}
