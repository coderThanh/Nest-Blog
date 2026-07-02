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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSelfDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '@/modules/user/entities/user.entity';
import {
  ApiCustomResponseOK,
  ApiCustomResponseOKFindAll,
} from '@/common/decorator/api-response-ok.decorator';
import { FindAllUserDto } from '@/modules/user/dto/find-all-user.dto';
import { ResponseFindAllData } from '@/shared/dto/response.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiAuthJwt } from '@/common/decorator/api-auth.decorator';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { CheckPermission } from '@/common/decorator/check-permission.decorator';
import { Prisma } from '@prisma/client';
import { PermissionAction } from '@/common/enum/role-permission.enum';
import { Public } from '@/common/decorator/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Post()
  @ApiAuthJwt()
  @ResponseMessage('Tạo người dùng thành công')
  @CheckPermission(Prisma.ModelName.User, PermissionAction.create)
  @ApiCustomResponseOK(User)
  async create(@Body() createUserDto: CreateUserDto) {
    const record = await this.userService.create(createUserDto);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiAuthJwt()
  @CheckPermission(Prisma.ModelName.User, PermissionAction.read)
  @ApiCustomResponseOKFindAll(User)
  async findAll(@Query() query: FindAllUserDto) {
    const { items, total } = await this.userService.findAllAndCount(query);

    return new ResponseFindAllData({
      items: items.map((item) =>
        plainToInstance(User, item, { excludeExtraneousValues: true }),
      ),
      meta: DatabaseUltil.getPaginationMeta({
        currentPage: query.page,
        limit: query.limit,
        totalItems: total,
      }),
    });
  }

  @Get('me')
  @ApiAuthJwt()
  @ApiCustomResponseOK(User)
  async findUserProfile(@GetUser('sub') userId: string) {
    const record = await this.userProfileService.findProfile(userId);
    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Get(':id')
  @Public()
  @ApiCustomResponseOK(User)
  async findOne(@Param('id') id: string) {
    const record = await this.userService.findOneOrThorw(id);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Patch('user-self')
  @ApiAuthJwt()
  @ResponseMessage('Cập nhật thông tin cá nhân thành công')
  @ApiCustomResponseOK(User)
  async updateUserSelf(
    @GetUser('userId') id: string,
    @Body() updateUserDto: UpdateUserSelfDto,
  ) {
    const record = await this.userService.update(id, updateUserDto);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ApiAuthJwt()
  @ResponseMessage('Cập nhật người dùng thành công')
  @CheckPermission(Prisma.ModelName.User, PermissionAction.update)
  @ApiCustomResponseOK(User)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const record = await this.userService.update(id, updateUserDto);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ApiAuthJwt()
  @ResponseMessage('Xóa người dùng thành công')
  @CheckPermission(Prisma.ModelName.User, PermissionAction.delete)
  @ApiCustomResponseOK(User)
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    const record = await this.userService.remove(id, userId);

    return plainToInstance(User, record, { excludeExtraneousValues: true });
  }
}
