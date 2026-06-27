import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PassportStrategyType } from '@/common/enum/ultil.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyType.jwt) {}
