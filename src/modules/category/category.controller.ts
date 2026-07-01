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
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import {
  Category,
  CategoryFindAll,
  CategoryRelation,
} from '@/modules/category/entities/category.entity';
import { BaseFindAllData } from '@/shared/types/response';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
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

@Controller('categorys')
@ApiAuthJwt()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ResponseMessage('Tạo danh mục thành công')
  @CheckPermission(Prisma.ModelName.Category, PermissionAction.create)
  @ApiCustomResponseOK(CategoryRelation)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiCustomResponseOKFindAll(CategoryFindAll)
  async findAll(@Query() query: FindAllCategoryDto) {
    const { items, total } = await this.categoryService.findAllAndCount(query);

    return {
      items: plainToInstance(CategoryFindAll, items, {
        excludeExtraneousValues: true,
      }),
      meta: DatabaseUltil.getPaginationMeta({
        currentPage: query.page,
        limit: query.limit,
        totalItems: total,
      }),
    } as BaseFindAllData;
  }

  @Get(':slug')
  @Public()
  @ApiCustomResponseOK(Category)
  async findOne(@Param('slug') slug: string) {
    const record = await this.categoryService.findOneOrThrow(slug);
    return plainToInstance(Category, record, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật danh mục thành công')
  @UseGuards(AuthorGuard)
  @CheckAuthor(Prisma.ModelName.Category)
  @CheckPermission(Prisma.ModelName.Category, PermissionAction.update)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const record = await this.categoryService.update(+id, updateCategoryDto);
    return plainToInstance(Category, record, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ResponseMessage('Xóa danh mục thành công')
  @UseGuards(AuthorGuard)
  @CheckAuthor(Prisma.ModelName.Category)
  @CheckPermission(Prisma.ModelName.Category, PermissionAction.delete)
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
