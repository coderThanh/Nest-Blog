import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { PassportStrategy } from '@nestjs/passport';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { Strategy } from 'passport-local';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { cuid } from '@/common/utils/helper.util';
@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyType.local,
) {
  constructor(private profileService: UserProfileService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    const user = await this.profileService.validateLoginUserOrThrow(
      username,
      password,
    );

    return {
      sub: user.id,
      userId: user.id,
      email: user.email,
      jti: cuid(),
    } as JwtPayload;
  }
}
