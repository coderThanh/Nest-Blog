import { CreateTokenDto } from '@/modules/token/dto/create-token.dto';
import { Injectable } from '@nestjs/common';
import { TokenRepository } from '@/modules/token/token.repository';
import { cuid } from '@/common/utils/helper.util';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepo: TokenRepository) {}

  async create(body: CreateTokenDto) {
    const token = cuid();

    return this.tokenRepo.create({ ...body, token });
  }

  async findOnByTokenOrThrow(token: string, expiresAt?: string) {
    return this.tokenRepo.findFirstOrThrow({
      where: {
        token,
        expiresAt: expiresAt
          ? {
              gt: expiresAt,
            }
          : undefined,
      },
    });
  }

  async removeByTokenOrThrow(token: string) {
    // validate token exist
    const tokenDb = await this.tokenRepo.findUniqueOrThrow({
      where: { token },
    });

    return this.tokenRepo.delete(tokenDb.id);
  }
}
