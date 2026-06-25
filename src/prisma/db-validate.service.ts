import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidateMessage } from '@/common/ultils/validate-message';

@Injectable()
export class DbValidateService {
  constructor(private readonly prisma: PrismaService) {}

  async validateExistOrThrow<T>(
    modelName: Prisma.ModelName,
    id: Array<T> | T,
    fieldName: string,
  ) {
    const modelService: any = this.prisma[modelName];

    if (!modelService)
      throw new InternalServerErrorException(
        `Model ${modelName} không tồn tại.`,
      );

    const idArray = Array.isArray(id) ? id : [id];

    if (idArray.length === 0) return;

    const count: number = await modelService.count({
      where: { id: { in: idArray } },
    });

    if (idArray.length !== count) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          fieldName,
          Array.isArray(id)
            ? ValidateMessage.someNotExist().rawMsg()
            : ValidateMessage.notExist().rawMsg(),
        ),
      );
    }
  }

  async validateUniqueOrThrow(
    modelName: Prisma.ModelName,
    valueWhere: Record<string, any>,
    fieldName: string,
  ) {
    const modelService: any = this.prisma[modelName];

    if (!modelService) {
      throw new InternalServerErrorException(
        `Model ${modelName} không tồn tại.`,
      );
    }

    const record = await modelService.findFirst({
      where: valueWhere,
      select: { id: true },
    });

    if (record) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          fieldName,
          ValidateMessage.isUnique().rawMsg(),
        ),
      );
    }
  }

  async generateUniqueSlugOrThrow(params: {
    modelName: Prisma.ModelName;
    valueWhereMore?: Record<string, any>;
    fieldName: string;
    columnName: string;
    slug: string;
  }): Promise<string> {
    const { modelName, valueWhereMore, fieldName, slug, columnName } = params;

    const modelService: any = this.prisma[modelName];

    if (!modelService) {
      throw new InternalServerErrorException(
        `Model ${modelName} không tồn tại.`,
      );
    }

    let uniqueSlug = slug;
    let currentIndexSlug = 1;
    const maxSlugCountCheck = 100;

    while (true) {
      const currRecordBySlug = await modelService.findFirst({
        where: { ...valueWhereMore, [columnName]: uniqueSlug },
        select: { id: true },
      });

      if (!currRecordBySlug) {
        return uniqueSlug;
      }

      uniqueSlug = `${slug}-${currentIndexSlug}`;
      currentIndexSlug++;

      // Safety break to prevent infinite loops
      if (currentIndexSlug > maxSlugCountCheck) {
        throw new BadRequestException(
          ValidateMessage.exceptionThrowErrorsField(
            fieldName,
            ValidateMessage.wasExisted().rawMsg(),
          ),
        );
      }
    }
  }
}
