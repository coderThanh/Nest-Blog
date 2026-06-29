import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PassportStrategyType } from '@/common/enum/ultil.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(PassportStrategyType.local) {}
