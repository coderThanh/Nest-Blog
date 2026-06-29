import * as bcrypt from 'bcrypt';

export class CryptoUtil {
  private static readonly SALT_ROUNDS = 10; // Độ an toàn tiêu chuẩn

  // DO NOT Change this logic hash because db user.password using
  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
