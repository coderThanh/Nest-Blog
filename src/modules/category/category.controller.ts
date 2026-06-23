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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import {
  Category,
  CategoryFindAll,
  CategoryRelation,
} from '@/modules/category/entities/category.entity';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiResponseDataFindAllMeta, ApiResponseOkDto } from '@/shared/dto';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { BaseFindAllData, FindAllDataMeta } from '@/shared/types';
import { DatabaseUltil } from '@/common/ultils';

@Controller('categorys')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, CategoryRelation)
  @ApiCustomResponseOK(CategoryRelation)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, CategoryFindAll, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(CategoryFindAll)
  async findAll(@Query() query: FindAllCategoryDto) {
    const { items, total } = await this.categoryService.findAllAndCount(query);

    const meta: FindAllDataMeta = DatabaseUltil.getPaginationMeta({
      currentPage: query.page,
      limit: query.limit,
      totalItems: total,
    });

    const data: BaseFindAllData = {
      items: plainToInstance(CategoryFindAll, items, {
        excludeExtraneousValues: true,
      }),
      meta,
    };

    return data;
  }

  @Get(':slug')
  @ApiExtraModels(ApiResponseOkDto, Category)
  @ApiCustomResponseOK(Category)
  async findOne(@Param('slug') slug: string) {
    const record = await this.categoryService.findOne(slug);

    return plainToInstance(Category, record, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
