import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'repeatPassword', 'username']),
) {}

export class UpdateUserSelfDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'repeatPassword', 'username', 'roleId']),
) {}
