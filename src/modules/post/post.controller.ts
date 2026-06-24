import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostDto } from '@/modules/post/dto/find-all-post.dto';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok';
import {
  PostEntity,
  PostFindAll,
  PostRelation,
} from '@/modules/post/entities/post.entity';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { ApiResponseDataFindAllMeta, ApiResponseOkDto } from '@/shared/dto';
import { plainToInstance } from 'class-transformer';
import { BaseFindAllData } from '@/shared/types';
import { DatabaseUltil } from '@/common/ultils';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, PostRelation)
  @ApiCustomResponseOK(PostRelation)
  async create(@Body() createPostDto: CreatePostDto) {
    const record = await this.postService.create(createPostDto);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, PostFindAll, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(PostFindAll)
  async findAll(@Query() query: FindAllPostDto) {
    const { items, total } = await this.postService.findAllAndCount(query);

    const result: BaseFindAllData = {
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
    };
    return result;
  }

  @Get(':slug')
  @ApiExtraModels(ApiResponseOkDto, PostEntity)
  @ApiCustomResponseOK(PostEntity)
  async findOne(@Param('slug') slug: string) {
    const record = await this.postService.findOne(slug);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const record = await this.postService.update(slug, updatePostDto);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.postService.remove(id);
    return plainToInstance(PostEntity, record, {
      excludeExtraneousValues: true,
    });
  }
}
