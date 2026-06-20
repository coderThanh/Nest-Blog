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
    const request = ctx.getRequest<Request>();
    const { method, url } = request;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let fieldErrors: ResponseBase['errorFields'] = undefined;

    // Bỏ qua log cho các request "rác" hoặc không quan trọng (ví dụ: 404 từ browser extensions)
    const ignoredPaths = ['/.well-known', '/favicon.ico', '/robots.txt'];
    const isIgnoredPath = ignoredPaths.some((path) => url.startsWith(path));

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resResponse = exception.getResponse();

      // Chỉ log lỗi nếu không phải là path bị bỏ qua hoặc không phải lỗi 404
      if (!(isIgnoredPath && statusCode === HttpStatus.NOT_FOUND)) {
        console.error(
          `-- [${method}] ${url} - AllExceptionsFilter Chi tiết lỗi:`,
          exception,
        );
      }

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
      timstamp: new Date().toISOString(),
    };

    response.status(statusCode).json(finalResponse);
  }
}
