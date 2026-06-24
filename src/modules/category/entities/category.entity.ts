import { Expose, Type } from 'class-transformer';
import { User, UserRelation } from '@/modules/user/entities/user.entity';

import { FileEntity } from '@/modules/file/entities/file.entity';
import { PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Category {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string | null;

  @Expose()
  thumbnailId: string | null;

  @Expose()
  thumbnail: FileEntity | null;

  @Expose()
  parentId: number | null;

  @Expose()
  // @Type(() => CategoryRelation) // nếu có type thì sẽ tiếp tục instance to object vào trong, nên bỏ vì chỉ response về cho client
  parent: CategoryRelation | null;

  @Expose()
  path: string | null;

  @Expose()
  children: CategoryRelation[] | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: UserRelation | null;

  //
  public static selectCategoryRelation: Prisma.CategorySelect = {
    id: true,
    name: true,
    slug: true,
    path: true,
  };

  //
  public static selectCategoryFindAll: Prisma.CategorySelect = {
    id: true,
    name: true,
    slug: true,
    thumbnailId: true,
    parentId: true,
    path: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  };
}

export class CategoryFindAll extends PickType(Category, [
  'id',
  'name',
  'slug',
  'thumbnailId',
  'thumbnail',
  'parentId',
  'parent',
  'path',
  'createdAt',
  'updatedAt',
  'createdBy',
  'createdByUser',
]) {}

export class CategoryRelation extends PickType(Category, [
  'id',
  'name',
  'slug',
  'path',
]) {}
