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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '@/modules/user/entities/user.entity';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  ApiResponseDataFindAllMeta,
  ApiResponseOkDto,
} from '@/shared/dto/response.dto';
import { FindAllUserDto } from '@/modules/user/dto/find-all-user.dto';
import { BaseFindAllData } from '@/shared/types/response';
import { DatabaseUltil } from '@/common/utils/database.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiExtraModels(ApiResponseOkDto, User)
  @ApiCustomResponseOK(User)
  async create(@Body() createUserDto: CreateUserDto) {
    const record = await this.userService.create(createUserDto);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiExtraModels(ApiResponseOkDto, User, ApiResponseDataFindAllMeta)
  @ApiCustomResponseOKFindAll(User)
  async findAll(@Query() query: FindAllUserDto) {
    const { items, total } = await this.userService.findAllAndCount(query);

    return {
      items: items.map((item) =>
        plainToInstance(User, item, { excludeExtraneousValues: true }),
      ),
      meta: DatabaseUltil.getPaginationMeta({
        currentPage: query.page,
        limit: query.limit,
        totalItems: total,
      }),
    } as BaseFindAllData;
  }

  @Get(':id')
  @ApiExtraModels(ApiResponseOkDto, User)
  @ApiCustomResponseOK(User)
  async findOne(@Param('id') id: string) {
    const record = await this.userService.findOneOrThorw(id);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ApiExtraModels(ApiResponseOkDto, User)
  @ApiCustomResponseOK(User)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const record = await this.userService.update(id, updateUserDto);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ApiExtraModels(ApiResponseOkDto, User)
  @ApiCustomResponseOK(User)
  async remove(@Param('id') id: string) {
    const record = await this.userService.remove(id);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }
}
