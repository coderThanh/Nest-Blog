import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';

import { CreateSessionDto } from '@/modules/auth/dto/create-session.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateSessionDto) {
    return this.prisma.client.session.create({
      data: body as Prisma.SessionUncheckedCreateInput,
      select: { id: true },
    });
  }

  async findFirst(args: Prisma.SessionFindFirstArgs) {
    return this.prisma.client.session.findFirst(args);
  }

  async findFirstOrThrow(args: Prisma.SessionFindFirstArgs) {
    const record = await this.prisma.client.session.findFirst(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFound().rawMsg());

    return record;
  }

  async findUnique(args: Prisma.SessionFindUniqueArgs) {
    return this.prisma.client.session.findUnique(args);
  }

  async findUniqueOrThrow(args: Prisma.SessionFindUniqueArgs) {
    const record = await this.prisma.client.session.findUnique(args);

    if (!record)
      throw new NotFoundException(ValidateMessage.notFoundToken().rawMsg());

    return record;
  }

  async delete(id: Session['id']) {
    return this.prisma.client.session.delete({
      where: { id },
      select: { id: true },
    });
  }
}
