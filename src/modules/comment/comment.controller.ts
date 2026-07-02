import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { plainToInstance } from 'class-transformer';

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
  @ApiCustomResponseOKFindAll(Comment)
  async findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCustomResponseOKFindAll(Comment)
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
