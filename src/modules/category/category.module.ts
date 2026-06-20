import { CategoryController } from './category.controller';
import { CategoryRepository } from '@/modules/category/category.repository';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
