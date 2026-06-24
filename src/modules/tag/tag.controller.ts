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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindAllTagDto } from '@/modules/tag/dto/find-all-tag.dto';
import { plainToInstance } from 'class-transformer';
import { Tag } from '@/modules/tag/entities/tag.entity';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiResponseDataFindAllMeta, ApiResponseOkDto } from '@/shared/dto';
import { BaseFindAllData } from '@/shared/types';
import { DatabaseUltil } from '@/common/ultils';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, Tag)
  @ApiCustomResponseOK(Tag)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, Tag, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(Tag)
  async findAll(@Query() query: FindAllTagDto) {
    const { total, items } = await this.tagService.findAllAndCount(query);

    return {
      items: items?.map((item) =>
        plainToInstance(Tag, item, {
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
  @ApiExtraModels(ApiResponseOkDto, Tag)
  @ApiCustomResponseOK(Tag)
  async findOne(@Param('slug') slug: string) {
    const record = await this.tagService.findOneOrthrow(slug);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ApiExtraModels(ApiResponseOkDto, Tag)
  @ApiCustomResponseOK(Tag)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const record = await this.tagService.update(id, updateTagDto);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ApiExtraModels(ApiResponseOkDto, Tag)
  @ApiCustomResponseOK(Tag)
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
