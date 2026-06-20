import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export function ParseIntPipeCustom(fieldName: string = 'ID') {
  return new ParseIntPipe({
    exceptionFactory: () => {
      return new BadRequestException(
        `${fieldName} phải là một số nguyên hợp lệ!`,
      );
    },
  });
}
