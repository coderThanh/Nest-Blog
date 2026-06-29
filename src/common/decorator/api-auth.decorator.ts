import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_JWT_AUTH } from '@/common/constant/util';
import { applyDecorators } from '@nestjs/common';

export function ApiAuthJwt() {
  return applyDecorators(ApiBearerAuth(SWAGGER_JWT_AUTH));
}
