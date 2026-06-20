import { Global, Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileRepository } from '@/modules/file/file.repository';
import { FileService } from './file.service';

@Global()
@Module({
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileRepository],
})
export class FileModule {}
