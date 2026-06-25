import * as bcrypt from 'bcrypt';

export class CryptoUtil {
  private static readonly SALT_ROUNDS = 10; // Độ an toàn tiêu chuẩn

  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
