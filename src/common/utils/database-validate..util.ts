import { BadRequestException, HttpException } from '@nestjs/common';

export class DatabaseValidate {
  static async validateOrThrow(fns: Array<unknown>) {
    const results = await Promise.allSettled(fns);

    let hasReject: boolean = false;

    const errors = results
      .filter((r) => {
        if (!hasReject) {
          hasReject = r.status === 'rejected';
        }
        return r.status === 'rejected';
      })
      .map((r) => {
        if (r.reason instanceof HttpException) {
          const resResponse = r.reason.getResponse();
          const resMessage = (resResponse as any).message;

          if (Array.isArray(resMessage)) return resMessage.join(',');

          return typeof resMessage === 'string' ? resMessage : null;
        }
      })
      .filter(Boolean);

    console.log(errors);

    if (hasReject) {
      throw new BadRequestException(errors.length > 0 ? errors : undefined);
    }
  }
}
