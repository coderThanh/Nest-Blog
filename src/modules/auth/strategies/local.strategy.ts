import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/shared/entities/auth.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private profileService: UserProfileService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.profileService.validateLoginUserOrThrow(
      username,
      password,
    );

    return {
      sub: user.id,
      userId: user.id,
      email: user.email,
      jti: uuidv7(),
    } as JwtPayload;
  }
}
