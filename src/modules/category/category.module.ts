import { CategoryController } from './category.controller';
import { CategoryEventListener } from '@/modules/category/listeners/category.listener';
import { CategoryRepository } from '@/modules/category/category.repository';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryEventListener],
  exports: [CategoryService],
})
export class CategoryModule {}
