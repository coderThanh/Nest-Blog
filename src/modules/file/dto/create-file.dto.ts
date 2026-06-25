import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsMaxLength } from '@/common/decorator/is-max-length.decorator';
import { StoreProvider } from '@prisma/client';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class CreateFileDto {
  @IsMaxLength()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  fileName: string;

  @IsMaxLength()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  extension: string;

  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  size: number | bigint;

  @IsMaxLength()
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  path: string;

  @IsEnum(StoreProvider, { message: ValidateMessage.isEnum().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  providerId: StoreProvider;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsOptional()
  providerPublicId?: string | null;
}
