import { Expose } from 'class-transformer';

export class RefreshtokenReturn {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
