import { CommentController } from './comment.controller';
import { CommentRepository } from '@/modules/comment/comment.repository';
import { CommentService } from './comment.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
