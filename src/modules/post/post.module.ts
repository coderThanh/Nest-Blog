import { CategoryModule } from '@/modules/category/category.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from '@/modules/post/post.repository';
import { PostService } from './post.service';
import { TagModule } from '@/modules/tag/tag.module';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
