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

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, PostRelation)
  @ApiCustomResponseOK(PostRelation)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, PostFindAll, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(PostFindAll)
  findAll(@Query() query: FindAllPostDto) {
    return this.postService.findAll();
  }

  @Get(':slug')
  @ApiExtraModels(ApiResponseOkDto, PostEntity)
  @ApiCustomResponseOK(PostEntity)
  findOne(@Param('slug') slug: string) {
    return this.postService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
