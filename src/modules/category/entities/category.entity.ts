import { Expose } from 'class-transformer';
import { File } from '@/modules/file/entities/file.entity';
import { PickType } from '@nestjs/swagger';
import { User } from '@/modules/user/entities/user.entity';

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
  thumbnail: File | null;

  @Expose()
  parentId: number | null;

  @Expose()
  parent: Category | null;

  @Expose()
  children: Category[] | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: User | null;
}

export class CategoryFindAll extends PickType(Category, [
  'id',
  'name',
  'slug',
  'thumbnailId',
  'thumbnail',
  'parentId',
  'parent',
  'createdAt',
  'updatedAt',
  'createdBy',
  'createdByUser',
]) {}

export class CategoryRelation extends PickType(Category, [
  'id',
  'name',
  'slug',
  'parentId',
]) {}
