import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '@/modules/user/entities/user.entity';
import { ApiCustomResponseOK } from '@/common/decorator/api-response-ok';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiResponseOkDto } from '@/shared/dto/response.dto';

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
  async findAll() {
    return this.userService.findAll();
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
