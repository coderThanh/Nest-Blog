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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { plainToInstance } from 'class-transformer';
import { Role } from '@/modules/role/entities/role.entity';
import { FindAllRoleDto } from '@/modules/role/dto/find-all-role.dto';
import { BaseFindAllData } from '@/shared/types/response';
import { DatabaseUltil } from '@/common/utils/database.util';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  ApiResponseDataFindAllMeta,
  ApiResponseOkDto,
} from '@/shared/dto/response.dto';
import { UpdateRolePermissionDto } from '@/modules/role/dto/update-role-permission.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, Role)
  @ApiCustomResponseOK(Role)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, Role, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(Role)
  async findAll(@Query() query: FindAllRoleDto) {
    const { total, items } = await this.roleService.findAllOrCount(query);

    return {
      items: items.map((item) => plainToInstance(Role, item)),
      meta: DatabaseUltil.getPaginationMeta({
        currentPage: query.page,
        limit: query.limit,
        totalItems: total,
      }),
    } as BaseFindAllData;
  }

  @Get(':id')
  @ApiExtraModels(ApiResponseOkDto, Role)
  @ApiCustomResponseOK(Role)
  async findOne(@Param('id') id: string) {
    const record = await this.roleService.findOneIncludePermissionsOrthrow(id);
    return plainToInstance(Role, record);
  }

  @Patch(':id')
  @ApiExtraModels(ApiResponseOkDto, Role)
  @ApiCustomResponseOK(Role)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const record = await this.roleService.update(id, updateRoleDto);
    return plainToInstance(Role, record);
  }

  @Patch(':id/permission')
  @ApiExtraModels(ApiResponseOkDto, Role)
  @ApiCustomResponseOK(Role)
  async setPermission(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRolePermissionDto,
  ) {
    const record = await this.roleService.setPermission(id, updateRoleDto);
    return plainToInstance(Role, record);
  }

  @Delete(':id')
  @ApiExtraModels(ApiResponseOkDto, Role)
  @ApiCustomResponseOK(Role)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
