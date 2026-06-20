import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from '@/modules/post/post.repository';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
