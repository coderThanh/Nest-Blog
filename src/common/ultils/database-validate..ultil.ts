import { BadRequestException } from '@nestjs/common';
import { ValidateMessage } from '@/common/ultils/validate-message';

export class DatabaseValidate {
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

  static async validateRecordEveryExistOrThrow<T>(
    ids: Array<T> | null,
    fnFind: (ids: Array<T>) => Promise<Array<{ id: T }> | null>,
    fieldName: string,
  ) {
    if (!ids || !ids.length) return;

    const records = await fnFind(ids);

    if (!records || !records.length) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          fieldName,
          ValidateMessage.someNotExist().rawMsg(),
        ),
      );
    }

    const idsFound = records.map((item) => item.id);

    const idsNotExist = ids.filter((id) => !idsFound.includes(id));

    if (idsNotExist.length) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          fieldName,
          ValidateMessage.someNotExist().rawMsg(),
        ),
      );
    }
  }

  static async validateRecordExistOrThrow<T>(
    id: T,
    fnFind: (id: T) => Promise<{ id: T } | null>,
    fieldName: string,
  ) {
    const records = await fnFind(id);

    if (!records) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          fieldName,
          ValidateMessage.notExist().rawMsg(),
        ),
      );
    }
  }
}
