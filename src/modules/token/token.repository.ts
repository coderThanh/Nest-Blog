import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';

import { CreateTokenDto } from '@/modules/token/dto/create-token.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateTokenDto & { token: string }) {
    return this.prisma.client.token.create({
      data: body as Prisma.TokenUncheckedCreateInput,
    });
  }

  async findFirst(args: Prisma.TokenFindFirstArgs) {
    return this.prisma.client.token.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.TokenFindFirstArgs) {
    const record = await this.prisma.client.token.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFoundToken().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.TokenFindUniqueArgs) {
    return this.prisma.client.token.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.TokenFindUniqueArgs) {
    const record = await this.prisma.client.token.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFoundToken().rawMsg());

    return record;
  }

  async delete(id: Token['id']) {
    return this.prisma.client.token.delete({
      where: { id },
      select: { id: true },
    });
  }
}
