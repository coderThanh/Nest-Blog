import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostDto } from '@/modules/post/dto/find-all-post.dto';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import {
  PostEntity,
  PostFindAll,
  PostRelation,
} from '@/modules/post/entities/post.entity';
import { plainToInstance } from 'class-transformer';
import { BaseFindAllData } from '@/shared/types/response';
import { DatabaseUltil } from '@/common/utils/database.util';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ResponseMessage('Tạo bài viết thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  @ApiCustomResponseOK(PostRelation)
  async create(@Body() createPostDto: CreatePostDto) {
    const record = await this.postService.create(createPostDto);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiCustomResponseOKFindAll(PostFindAll)
  async findAll(@Query() query: FindAllPostDto) {
    const { items, total } = await this.postService.findAllAndCount(query);

    return {
      items: items?.map((item) =>
        plainToInstance(PostEntity, item, {
          excludeExtraneousValues: true,
        }),
      ),
      meta: DatabaseUltil.getPaginationMeta({
        currentPage: query.page,
        limit: query.limit,
        totalItems: total,
      }),
    } as BaseFindAllData;
  }

  @Get(':slug')
  @ApiCustomResponseOK(PostEntity)
  async findOne(@Param('slug') slug: string) {
    const record = await this.postService.findOneOrThrow(slug);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật bài viết thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const record = await this.postService.update(id, updatePostDto);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ResponseMessage('Xóa bài viết thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  async remove(@Param('id') id: string) {
    const record = await this.postService.remove(id);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }
}
