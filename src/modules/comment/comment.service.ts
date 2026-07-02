import { BadRequestException, Injectable } from '@nestjs/common';

import { Comment } from '@/modules/comment/entities/comment.entity';
import { CommentRepository } from '@/modules/comment/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DatabaseValidate } from '@/common/utils/database-validate..util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { Prisma } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { isNotNullOrUndefined } from '@/common/utils/helper.util';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly dbValidateService: DbValidateService,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const { parentId, replyToId, targetType, targetId } = createCommentDto;

    //
    if (replyToId && replyToId === parentId) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CommentScalarFieldEnum.replyToId,
          ValidateMessage.isNotSameField(
            Prisma.CommentScalarFieldEnum.parentId,
          ).rawMsg(),
        ),
      );
    }

    //
    if (parentId) {
      const parent = await this.commentRepo.findUnique({
        where: { id: parentId },
        select: { id: true, parentId: true },
      });

      if (!parent) {
        throw new BadRequestException(
          ValidateMessage.exceptionThrowErrorsField(
            Prisma.CommentScalarFieldEnum.parentId,
            ValidateMessage.notFound().rawMsg(),
          ),
        );
      }

      if (parent.parentId) {
        throw new BadRequestException(
          ValidateMessage.exceptionThrowErrorsField(
            Prisma.CommentScalarFieldEnum.parentId,
            ValidateMessage.isRootRecord().rawMsg(),
          ),
        );
      }
    }

    //
    await DatabaseValidate.validateOrThrow([
      this.dbValidateService.validateRecordExistOrThrow(
        targetType,
        targetId,
        Prisma.CommentScalarFieldEnum.targetId,
      ),
      isNotNullOrUndefined(replyToId)
        ? this.dbValidateService.validateRecordExistOrThrow(
            Prisma.ModelName.Comment,
            replyToId,
            Prisma.CommentScalarFieldEnum.replyToId,
          )
        : undefined,
    ]);

    return this.commentRepo.create(createCommentDto);
  }

  findAll() {
    return `This action returns all comment`;
  }

  // async findAll(query: FindAllPostDto) {
  //   return this.postRepo.findMany(PostService.getCommonFindAllOptions(query));
  // }

  // async findAllAndCount(query: FindAllPostDto) {
  //   return this.postRepo.findManyAndCount(
  //     PostService.getCommonFindAllOptions(query),
  //   );
  // }

  async findOneOrThrow(id: string) {
    return this.commentRepo.findUniqueOrThrow({
      where: { id },
      include: Comment.commentInluce,
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.commentRepo.findUniqueOrThrow({ where: { id } });
    return this.commentRepo.patch(id, updateCommentDto);
  }

  async remove(id: string) {
    await this.commentRepo.findUniqueOrThrow({ where: { id } });
    return this.commentRepo.delete(id);
  }

  //
  // static getCommonFindAllWhere(query: FindAllPostDto): Prisma.PostWhereInput[] {
  //   const {
  //     ids,
  //     excludeIds,
  //     categoryIds,
  //     categoryPath,
  //     search,
  //     fromDate,
  //     toDate,
  //   } = query;

  //   const andCondition: Prisma.PostWhereInput[] = [];

  //   if (ids?.length) andCondition.push({ id: { in: ids } });

  //   if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

  //   if (categoryIds?.length)
  //     andCondition.push({ categories: { some: { id: { in: categoryIds } } } });

  //   if (categoryPath)
  //     andCondition.push({
  //       categories: { some: { path: { startsWith: categoryPath } } },
  //     });

  //   if (search)
  //     andCondition.push({
  //       search: { contains: removeVietnameseAccents(search).toLowerCase() },
  //     });

  //   if (fromDate) {
  //     andCondition.push({
  //       createdAt: { gte: startOfDay(new Date(fromDate)) },
  //     });
  //   }

  //   if (toDate) {
  //     andCondition.push({
  //       createdAt: { lt: endOfDay(new Date(toDate)) },
  //     });
  //   }

  //   return andCondition;
  // }

  // static getCommonFindAllOptions(
  //   query: FindAllPostDto,
  // ): Prisma.PostFindManyArgs {
  //   const { page, limit, orderDir, orderBy } = query;

  //   const order: Prisma.PostOrderByWithRelationInput = {
  //     [orderBy as Prisma.PostScalarFieldEnum]: orderDir,
  //   };

  //   return {
  //     where: { AND: this.getCommonFindAllWhere(query) },
  //     select: {
  //       ...PostEntity.selectFindAll,
  //       ...PostService.getCommonIncludeArg,
  //     },
  //     orderBy: order,
  //     take: limit,
  //     skip: DatabaseUltil.getSkip(page, limit),
  //   };
  // }
}
