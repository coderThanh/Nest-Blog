import { Expose, Type } from 'class-transformer';
import { GenderEnum, Prisma } from '@prisma/client';

import { Category } from '@/modules/category/entities/category.entity';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { PostEntity } from '@/modules/post/entities/post.entity';

export class User {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string | null;

  search: string | null;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  dob: string | null;

  @Expose()
  gender?: GenderEnum;

  @Expose()
  verified: string | null;

  passwordHash: string;

  @Expose()
  thumbnailId: string | null;

  @Expose()
  thumbnail: FileEntity | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  @Type(() => User)
  createdByUser: User | null;

  @Expose()
  deletedBy: string | null;

  @Expose()
  @Type(() => User)
  deletedByUser: User | null;

  @Expose()
  @Type(() => PostEntity)
  posts: PostEntity[] | null;

  @Expose()
  @Type(() => FileEntity)
  files: FileEntity[] | null;

  @Expose()
  @Type(() => Category)
  categories: Category[] | null;

  static selectRelation: Prisma.UserSelect = {
    id: true,
    name: true,
  };
}
