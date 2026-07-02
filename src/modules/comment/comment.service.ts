import { BadRequestException, Injectable } from '@nestjs/common';

import { Comment } from '@/modules/comment/entities/comment.entity';
import { CommentRepository } from '@/modules/comment/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FindAllCommentDto } from '@/modules/comment/dto/find-all-comment.dto';
import { Prisma } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly dbValidateService: DbValidateService,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const { parentId, replyToId, targetType, targetId } = createCommentDto;

    await Promise.all([
      this.validateParent(parentId),
      this.validateTarget(targetType, targetId),
      this.validateReply(replyToId, parentId),
    ]);

    return this.commentRepo.create(createCommentDto);
  }

  async findAll(query: FindAllCommentDto) {
    return this.commentRepo.findMany(
      CommentService.getCommonFindAllOptions(query),
    );
  }

  async findAllAndCount(query: FindAllCommentDto) {
    return this.commentRepo.findManyAndCount(
      CommentService.getCommonFindAllOptions(query),
    );
  }

  async findOneOrThrow(id: string) {
    return this.commentRepo.findUniqueOrThrow({
      where: { id },
      include: Comment.commentInclude,
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
  static getCommonFindAllWhere(
    query: FindAllCommentDto,
  ): Prisma.CommentWhereInput[] {
    const { parentId, replyToId, targetId, targetType, createdBy } = query;

    const andCondition: Prisma.CommentWhereInput[] = [];

    // accept id and null
    if (parentId !== undefined) andCondition.push({ parentId: parentId });

    if (replyToId) andCondition.push({ replyToId: replyToId });

    if (targetId) andCondition.push({ targetId: targetId });

    if (targetType) andCondition.push({ targetType: targetType });

    if (createdBy !== undefined) andCondition.push({ createdBy: createdBy });

    return andCondition;
  }

  static getCommonFindAllOptions(
    query: FindAllCommentDto,
  ): Prisma.CommentFindManyArgs {
    const { limit, orderDir, orderBy, lastCursor } = query;

    const order: Prisma.CommentOrderByWithRelationInput[] = [
      { [orderBy as Prisma.CommentScalarFieldEnum]: orderDir },
      { id: orderDir }, // Tie-breaker
    ];

    const options: Prisma.CommentFindManyArgs = {
      where: { AND: this.getCommonFindAllWhere(query) },
      orderBy: order,
      take: limit,
      include: Comment.commentInclude,
    };

    if (lastCursor) {
      options.cursor = { id: lastCursor };
      options.skip = 1;
    }

    return options;
  }

  private async validateParent(parentId?: string | null) {
    if (!parentId) return;

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

  private async validateTarget(targetType: Prisma.ModelName, targetId: string) {
    await this.dbValidateService.validateRecordExistOrThrow(
      targetType,
      targetId,
      Prisma.CommentScalarFieldEnum.targetId,
    );
  }

  private async validateReply(
    replyToId?: string | null,
    parentId?: string | null,
  ) {
    if (!replyToId) return;

    const reply = await this.commentRepo.findUnique({
      where: { id: replyToId },
      select: { parentId: true },
    });

    if (!reply) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CommentScalarFieldEnum.replyToId,
          ValidateMessage.notFound().rawMsg(),
        ),
      );
    }

    if (reply.parentId && reply.parentId !== parentId) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CommentScalarFieldEnum.replyToId,
          ValidateMessage.isSameParent().rawMsg(),
        ),
      );
    }
  }
}
