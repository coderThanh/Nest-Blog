import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import { BaseFindAllData } from '@/shared/types/response';
import { CreateRoleDto } from './dto/create-role.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { FindAllRoleDto } from '@/modules/role/dto/find-all-role.dto';
import { Role } from '@/modules/role/entities/role.entity';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionDto } from '@/modules/role/dto/update-role-permission.dto';
import { plainToInstance } from 'class-transformer';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiAuthJwt()
  @ApiCustomResponseOK(Role)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
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
  @ApiCustomResponseOK(Role)
  async findOne(@Param('id') id: string) {
    const record = await this.roleService.findOneIncludePermissionsOrthrow(id);
    return plainToInstance(Role, record);
  }

  @Patch(':id')
  @ApiCustomResponseOK(Role)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const record = await this.roleService.update(id, updateRoleDto);
    return plainToInstance(Role, record);
  }

  @Patch(':id/permission')
  @ApiCustomResponseOK(Role)
  async setPermission(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRolePermissionDto,
  ) {
    const record = await this.roleService.setPermission(id, updateRoleDto);
    return plainToInstance(Role, record);
  }

  @Delete(':id')
  @ApiCustomResponseOK(Role)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
