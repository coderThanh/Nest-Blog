import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { StoreProvider } from '@prisma/client';
import { ValidateMessage } from '@/common/ultils';

export class CreateFileDto {
  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  fileName: string;

  @IsString({ message: ValidateMessage.isString().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  extension: string;

  @IsInt({ message: ValidateMessage.isInt().exceptionMsg() })
  @IsNotEmpty({ message: ValidateMessage.isNotEmpty().exceptionMsg() })
  size: number | bigint;

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
