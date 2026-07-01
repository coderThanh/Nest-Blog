import { Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { UserRelation } from '@/modules/user/entities/user.entity';

export class Comment {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  targetId: string;

  @Expose()
  targetType: Prisma.ModelName;

  @Expose()
  parentId: string | null;

  @Expose()
  parent: Comment | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: UserRelation | null;
}
