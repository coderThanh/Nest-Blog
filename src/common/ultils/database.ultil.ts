import { BadRequestException } from '@nestjs/common';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class DatabaseUltil {
  static async generateSlugFromDB<T>(
    defaultSlug: string,
    findUnique: (slug: string) => Promise<T | null>,
  ): Promise<string | null> {
    let uniqueSlug = defaultSlug;
    let currentIndexSlug = 1;
    const maxSlugCountCheck = 100;

    while (true) {
      const currRecordBySlug = await findUnique(uniqueSlug);

      if (!currRecordBySlug) {
        return uniqueSlug;
      }

      uniqueSlug = `${defaultSlug}-${currentIndexSlug}`;
      currentIndexSlug++;

      // Safety break to prevent infinite loops
      if (currentIndexSlug > maxSlugCountCheck) {
        return null;
      }
    }
  }

  static async generateSlugFromDBOrthrow<T>(
    defaultSlug: string,
    findUnique: (slug: string) => Promise<T | null>,
    field: string,
  ): Promise<string> {
    const slug = await this.generateSlugFromDB(defaultSlug, findUnique);

    if (!slug) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          field,
          ValidateMessage.wasExisted().rawMsg(),
        ),
      );
    }

    return slug;
  }

  static async validateUniqueName(
    findUnique: () => Promise<any>,
    name: string,
  ) {
    const hasRecord = await findUnique();

    if (hasRecord) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          name,
          ValidateMessage.wasExisted().rawMsg(),
        ),
      );
    }
  }

  static getSkip(page: number, limit: number): number {
    return Math.max(page - 1, 0) * limit;
  }

  static getPaginationMeta(params: {
    currentPage: number;
    limit: number;
    totalItems: number;
  }): {
    currentPage: number;
    nextPage: number | null;
    totalPage: number;
    totalItems: number;
    limit: number;
  } {
    const { limit, currentPage, totalItems } = params;

    const totalPage: number = Math.ceil(totalItems / limit);
    const nextPage: number | null =
      currentPage + 1 <= totalPage ? currentPage + 1 : null;

    return {
      currentPage,
      totalItems,
      nextPage: nextPage,
      totalPage: totalPage,
      limit,
    };
  }
}
