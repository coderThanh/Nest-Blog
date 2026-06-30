import { ConfigService } from '@nestjs/config';

export class ConfigUltils {
  configService: ConfigService;

  constructor(readonly _configService: ConfigService) {
    this.configService = _configService;
  }

  public getDataBaseURL(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  public getDebugCheck(): boolean | undefined {
    return this.configService.get<boolean>('isDebug');
  }

  public getPort(): number | undefined {
    return this.configService.get<number>('port');
  }

  public getPasswordResetExpiresInMinutes(): number | undefined {
    return this.configService.get<number>('passwordResetExpiresInMinutes');
  }

  public getJwtAccessSecret(): string | undefined {
    return this.configService.get<string>('jwt.accessSecret');
  }

  public getJwtAccessExpiresIn(): string | undefined {
    return this.configService.get<string>('jwt.accessExpiresIn');
  }

  public getJwtRefreshSecret(): string | undefined {
    return this.configService.get<string>('jwt.refreshSecret');
  }

  public getJwtRefreshExpiresIn(): string | undefined {
    return this.configService.get<string>('jwt.refreshExpiresIn');
  }
}
