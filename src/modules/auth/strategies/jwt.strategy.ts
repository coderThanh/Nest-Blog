import { BadRequestException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, ReqUserEmbed } from '@/shared/entities/auth.entity';

import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { PassportStrategy } from '@nestjs/passport';
import { PassportStrategyType } from '@/common/enum/ultil.enum';
import { Role } from '@/modules/role/entities/role.entity';
import { RoleService } from '@/modules/role/role.service';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyType.jwt,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly profileService: UserProfileService,
    private readonly roleService: RoleService,
    private readonly cls: ClsService<GlobalClsStore>,
  ) {
    const config = new ConfigUltils(configService);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getJwtAccessSecret() as string,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.profileService.findOneForAuthGuardUserOrThrow(
      payload.sub,
    );

    //  Cache Hit here when has redis
    const rolePlain = await this.roleService.findOneIncludePermissions(
      user.roleId,
    );

    if (!rolePlain) {
      throw new BadRequestException(
        'Không tìm thấy vai trò khi xác minh tài khoản',
      );
    }

    const role = plainToInstance(Role, rolePlain);

    // to autdit in prisma extension
    this.cls.set('userId', user.id);

    return { ...payload, permissions: role.permissions } as ReqUserEmbed;
  }
}
