import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagRepository } from '@/modules/tag/tag.repository';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
