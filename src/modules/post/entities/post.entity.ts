import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Prisma, RecordStatus } from '@prisma/client';

import { Category } from '@/modules/category/entities/category.entity';
import { User } from '@/modules/user/entities/user.entity';

export class PostEntity {
  @Expose()
  id: string;

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
  @Transform(({ obj }: { obj: PostEntity }) => {
    if (obj.categories === undefined) return undefined;
    return obj.categories?.map((cat) => cat.id) || [];
  })
  categoryIds?: number[];

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

  public static selectFindAll: Prisma.PostSelect = {
    id: true,
    name: true,
    slug: true,
    status: true,
    thumbnailId: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  };
}

export class PostFindAll extends PickType(PostEntity, [
  'id',
  'name',
  'slug',
  'status',
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
