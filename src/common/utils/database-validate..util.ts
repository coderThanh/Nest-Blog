import { BadRequestException, HttpException } from '@nestjs/common';

export class DatabaseValidate {
  static async validateOrThrow(fns: Array<unknown>) {
    const results = await Promise.allSettled(fns);

    const errors = results
      .filter((r) => {
        return r.status === 'rejected';
      })
      .map((r) => {
        if (r.reason instanceof HttpException) {
          const resResponse = r.reason.getResponse();
          return (resResponse as any).message;
        }
        return null;
      });

    const errorsNormalize: any[] = [];
    errors.forEach((resMessage) => {
      if (Array.isArray(resMessage)) return errorsNormalize.push(...resMessage);
      return typeof resMessage === 'string'
        ? errorsNormalize.push(resMessage)
        : null;
    });

    if (errors.length) {
      throw new BadRequestException(
        errorsNormalize.length > 0 ? errorsNormalize : undefined,
      );
    }
  }
}
