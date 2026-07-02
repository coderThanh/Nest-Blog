import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { CheckPermission } from '@/common/decorator/check-permission.decorator';
import { Prisma } from '@prisma/client';
import { PermissionAction } from '@/common/enum/role-permission.enum';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAllCursor,
} from '@/common/decorator/api-response-ok.decorator';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { plainToInstance } from 'class-transformer';
import { FindAllCommentDto } from '@/modules/comment/dto/find-all-comment.dto';
import { ResponseFindAllData } from '@/shared/dto/response.dto';

@ApiAuthJwt()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @CheckPermission(Prisma.ModelName.Comment, PermissionAction.create)
  @ApiCustomResponseOK(Comment)
  @ResponseMessage('Bình luận thành công')
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @Public()
  @ApiCustomResponseOKFindAllCursor(Comment)
  async findAll(@Query() query: FindAllCommentDto) {
    const { items, total } = await this.commentService.findAllAndCount(query);

    return new ResponseFindAllData({
      items: plainToInstance(Comment, items, { excludeExtraneousValues: true }),
      meta: {
        limit: query.limit,
        totalItems: total,
        lastCursor: items[items.length - 1]?.id ?? null,
      },
    });
  }

  @Get(':id')
  @Public()
  @ApiCustomResponseOK(Comment)
  async findOne(@Param('id') id: string) {
    const record = await this.commentService.findOneOrThrow(id);

    return plainToInstance(Comment, record);
  }

  @Patch(':id')
  @ApiCustomResponseOK(Comment)
  @CheckPermission(Prisma.ModelName.Comment, PermissionAction.update)
  @ResponseMessage('Cập nhật bình luận thành công')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const record = await this.commentService.update(id, updateCommentDto);

    return plainToInstance(Comment, record, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiCustomResponseOK(null)
  @CheckPermission(Prisma.ModelName.Comment, PermissionAction.delete)
  @ResponseMessage('Xoá bình luận thành công')
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
