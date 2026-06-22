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
import { Category } from '@/modules/category/entities/category.entity';
import { ApiCustomResponseOK } from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiResponseOkDto } from '@/shared/dto';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { ParseIntPipeCustom } from '@/common/pipes';

@Controller('categorys')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query() query: FindAllCategoryDto) {
    return this.categoryService.findAll(query);
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
