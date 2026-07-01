import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { Prisma } from '@prisma/client';
import { PermissionAction } from '@/common/enum/role-permission.enum';
import { CheckPermission } from '@/common/decorator/check-permission.decorator';
import { Public } from '@/common/decorator/public.decorator';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import { FileEntity } from '@/modules/file/entities/file.entity';

@Controller('file')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiAuthJwt()
  @CheckPermission(Prisma.ModelName.File, PermissionAction.create)
  @ApiCustomResponseOK(FileEntity)
  @ResponseMessage('Tải lên tệp thành công')
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  @Public()
  @ApiCustomResponseOKFindAll(FileEntity)
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCustomResponseOK(FileEntity)
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  @ApiAuthJwt()
  @CheckPermission(Prisma.ModelName.File, PermissionAction.update)
  @ApiCustomResponseOK(FileEntity)
  @ResponseMessage('Cập nhật tệp thành công')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  @ApiAuthJwt()
  @CheckPermission(Prisma.ModelName.File, PermissionAction.delete)
  @ApiCustomResponseOK(null)
  @ResponseMessage('Xóa tệp thành công')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
