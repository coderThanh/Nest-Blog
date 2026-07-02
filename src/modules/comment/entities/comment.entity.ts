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
  replyToId: string | null;

  @Expose()
  replyToComment: Comment | null;

  @Expose()
  createdAt: string | null;

  @Expose()
  updatedAt: string | null;

  @Expose()
  createdBy: string | null;

  @Expose()
  createdByUser: UserRelation | null;

  static commentInclude: Prisma.CommentInclude = {
    createdByUser: {
      select: {
        id: true,
        name: true,
        thumbnailId: true,
        thumbnal: {
          select: {
            id: true,
            path: true,
          },
        },
      },
    },
    replyToComment: {
      select: {
        id: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };
}
