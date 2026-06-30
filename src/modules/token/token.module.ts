import { Module } from '@nestjs/common';
import { TokenRepository } from '@/modules/token/token.repository';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
