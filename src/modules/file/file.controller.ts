import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ResponseMessage('Tải lên tệp thành công')
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tệp thành công')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tệp thành công')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
