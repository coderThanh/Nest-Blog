import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { PasswordService } from '@/modules/auth/pasword.service';
import { RoleModule } from '@/modules/role/role.module';
import { SessionRepository } from '@/modules/auth/session.repository';
import { TokenModule } from '@/modules/token/token.module';
import { UserModule } from '@/modules/user/user.module';
import { UserService } from '@/modules/user/user.service';
import { VerifyAccountService } from '@/modules/auth/verify-account.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PassportStrategyType.jwt,
    }),
    JwtModule.register({}),
    UserModule,
    RoleModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    SessionRepository,
    PasswordService,
    VerifyAccountService,
  ],
})
export class AuthModule {}
