import { Expose } from 'class-transformer';

export class LoginToken {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
