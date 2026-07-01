import { BadRequestException, Injectable } from '@nestjs/common';

import { CommentRepository } from '@/modules/comment/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DatabaseValidate } from '@/common/utils/database-validate..util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { Prisma } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@/modules/user/entities/user.entity';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly dbValidateService: DbValidateService,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    await DatabaseValidate.validateOrThrow([
      this.dbValidateService.validateRecordExistOrThrow(
        createCommentDto.targetType,
        createCommentDto.targetId,
        Prisma.CommentScalarFieldEnum.targetId,
      ),
      createCommentDto.parentId
        ? this.dbValidateService.validateRecordExistOrThrow(
            Prisma.ModelName.Comment,
            createCommentDto.parentId,
            Prisma.CommentScalarFieldEnum.parentId,
          )
        : undefined,
    ]);

    return this.commentRepo.create(createCommentDto);
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOneOrThrow(id: string) {
    return this.commentRepo.findUniqueOrThrow({
      where: { id },
      include: {
        createdByUser: { select: User.selectRelation },
        parent: true,
      },
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
}
