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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindAllTagDto } from '@/modules/tag/dto/find-all-tag.dto';
import { plainToInstance } from 'class-transformer';
import { Tag } from '@/modules/tag/entities/tag.entity';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import { DatabaseUltil } from '@/common/utils/database.util';
import {
  ApiResponseOkDto,
  ApiResponseDataFindAllMeta,
} from '@/shared/dto/response.dto';
import { BaseFindAllData } from '@/shared/types/response';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ResponseMessage('Tạo nhãn thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  @ApiCustomResponseOK(Tag)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
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
  @ApiCustomResponseOK(Tag)
  async findOne(@Param('slug') slug: string) {
    const record = await this.tagService.findOneOrthrow(slug);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật nhãn thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  @ApiCustomResponseOK(Tag)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const record = await this.tagService.update(id, updateTagDto);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ResponseMessage('Xóa nhãn thành công')
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  @ApiCustomResponseOK(Tag)
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
