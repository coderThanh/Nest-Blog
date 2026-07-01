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
import { BaseFindAllData } from '@/shared/types/response';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { CheckPermission } from '@/common/decorator/check-permission.decorator';
import { Prisma } from '@prisma/client';
import { PermissionAction } from '@/common/enum/role-permission.enum';
import { Public } from '@/common/decorator/public.decorator';
import { AuthorGuard } from '@/common/guards/author.guard';
import { CheckAuthor } from '@/common/decorator/check-author.decorator';

@Controller('tags')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiAuthJwt()
  @ResponseMessage('Tạo nhãn thành công')
  @CheckPermission(Prisma.ModelName.Tag, PermissionAction.create)
  @ApiCustomResponseOK(Tag)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @Public()
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
  @Public()
  @ApiCustomResponseOK(Tag)
  async findOne(@Param('slug') slug: string) {
    const record = await this.tagService.findOneOrthrow(slug);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ApiAuthJwt()
  @ResponseMessage('Cập nhật nhãn thành công')
  @UseGuards(AuthorGuard)
  @CheckAuthor(Prisma.ModelName.Tag)
  @CheckPermission(Prisma.ModelName.Tag, PermissionAction.update)
  @ApiCustomResponseOK(Tag)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const record = await this.tagService.update(id, updateTagDto);

    return plainToInstance(Tag, record, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ApiAuthJwt()
  @ResponseMessage('Xóa nhãn thành công')
  @UseGuards(AuthorGuard)
  @CheckAuthor(Prisma.ModelName.Tag)
  @CheckPermission(Prisma.ModelName.Tag, PermissionAction.delete)
  @ApiCustomResponseOK(Tag)
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
