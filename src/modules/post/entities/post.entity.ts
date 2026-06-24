import { Expose, Type } from 'class-transformer';
import { Prisma, RecordStatus } from '@prisma/client';

import { Category } from '@/modules/category/entities/category.entity';
import { PickType } from '@nestjs/swagger';
import { User } from '@/modules/user/entities/user.entity';

export class PostEntity {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  status: RecordStatus;

  search: string | null;

  @Expose()
  content: string;

  @Expose()
  shortDescription: string | null;

  @Expose()
  thumbnailId: string | null;

  @Expose()
  thumbnail: File | null;

  @Expose()
  @Type(() => Category)
  categories: Category[] | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  @Type(() => User)
  createdByUser: User | null;

  public static selectRelation: Prisma.PostSelect = {
    id: true,
    name: true,
    slug: true,
  };
}

export class PostFindAll extends PickType(PostEntity, [
  'id',
  'name',
  'slug',
  'status',
  'shortDescription',
  'categories',
  'thumbnailId',
  'thumbnail',
  'createdAt',
  'updatedAt',
  'createdBy',
  'createdByUser',
]) {}

export class PostRelation extends PickType(PostEntity, [
  'id',
  'name',
  'slug',
]) {}
