import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {
  NormalizeString,
  ToLowerCaseAndTrim,
} from '@/common/decorator/normalize-string';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '@prisma/client';
import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { IsPassword } from '@/common/decorator/is-strong-password.decorator';
import { IsPhoneNumberByCountry } from '@/common/decorator/is-phone.decorator';
import { IsRepeat } from '@/common/decorator/is-repeat.decorrator';
import { ValidateMessage } from '@/common/utils/validate-message.util';

export class CreateUserDto {
  /** @example 'Nguyễn Văn A' */
  @IsMaxLength()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @NormalizeString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: null })
  @IsPhoneNumberByCountry(undefined, {
    message: ValidateMessage.isPhone().exceptionMsg(),
  })
  @IsOptional()
  phone?: string | null;

  /** @example 'example@gmail.com' */
  @IsMaxLength()
  @IsEmail(undefined, {
    message: ValidateMessage.isEmail().exceptionMsg(),
  })
  @ToLowerCaseAndTrim()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  email: string;

  @IsMaxLength()
  @IsString({
    message: ValidateMessage.isString().exceptionMsg(),
  })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  username: string;

  /** @example 'clv1j8y6m000008l2h000002' */
  @IsString({
    message: ValidateMessage.isString().exceptionMsg(),
  })
  @NormalizeString()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  roleId: string;

  /** @example '2000-06-25T07:41:05.871Z' */
  @IsDateString(undefined, {
    message: ValidateMessage.isString().exceptionMsg(),
  })
  @NormalizeString()
  @IsOptional()
  dob?: string | null;

  @IsEnum(GenderEnum, {
    message: ValidateMessage.isEnum().exceptionMsg(),
  })
  @IsOptional()
  gender?: GenderEnum | null;

  /** @example 'User@123456' */
  @IsPassword()
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  password: string;

  /** @example 'User@123456' */
  @IsRepeat('password', {
    message: ValidateMessage.isRepeatMatch().exceptionMsg(),
  })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  repeatPassword: string;

  @ApiPropertyOptional({ example: null })
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  thumbnailId?: string | null;
}
