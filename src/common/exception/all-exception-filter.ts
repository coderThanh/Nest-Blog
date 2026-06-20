import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { ResponseBase } from '@/shared/types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let fieldErrors: ResponseBase['errorFields'] = undefined;

    // console.error('Chi tiết lỗi:', exception);

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resResponse = exception.getResponse();

      if (
        statusCode === HttpStatus.BAD_REQUEST &&
        typeof resResponse === 'object'
      ) {
        const resMessage = (resResponse as any).message;

        if (Array.isArray(resMessage)) {
          message = 'Dữ liệu không hợp lệ';
          fieldErrors = {};

          resMessage.forEach((msg: string) => {
            const dashIndex = msg.indexOf('-');
            if (dashIndex === -1) return;

            const rawField = msg.substring(0, dashIndex);
            const errorMsg = msg.substring(dashIndex + 1);

            // Bỏ qua các câu thông báo hệ thống tự sinh làm bẩn danh sách lỗi
            if (
              errorMsg.includes('nested property') ||
              errorMsg.includes('each value in')
            ) {
              return;
            }

            // GIỮ NGUYÊN ĐỊNH DẠNG GỐC: Không dùng Regex biến đổi nữa
            // NestJS trả về như thế nào (ví dụ: "items.0.productId"), ta giữ nguyên làm key luôn
            fieldErrors![rawField] = errorMsg;
          });
        } else {
          message =
            typeof resResponse === 'string'
              ? resResponse
              : (resResponse as any).message || message;
        }
      } else {
        message =
          typeof resResponse === 'string'
            ? resResponse
            : (resResponse as any).message || message;
      }
    }

    const finalResponse: ResponseBase = {
      success: false,
      statusCode,
      message,
      errorFields: fieldErrors,
    };

    response.status(statusCode).json(finalResponse);
  }
}
