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
}
