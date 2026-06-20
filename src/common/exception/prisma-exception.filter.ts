import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ResponseBase } from '@/shared/types';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { url, method, body, headers } = request;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorFields: ResponseBase['errorFields'] = undefined;

    console.error(
      `-- [${method}] ${url} PrismaClientExceptionFilter Chi tiết lỗi:`,
      exception,
    );

    switch (exception.code) {
      // P2002: Unique constraint failed
      case 'P2002': {
        statusCode = HttpStatus.CONFLICT;
        const targets = exception.meta?.target as string[];
        message = 'Dữ liệu đã tồn tại trong hệ thống';
        if (targets && Array.isArray(targets)) {
          errorFields = {};
          targets.forEach((field) => {
            errorFields![field] = `Trường ${field} đã bị trùng lặp`;
          });
        }
        break;
      }

      // P2025: An operation failed because it depends on one or more records that were required but not found
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message =
          (exception.meta?.cause as string) || 'Không tìm thấy bản ghi yêu cầu';
        break;

      // P2003: Foreign key constraint failed on the field
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Dữ liệu liên quan không tồn tại hoặc đang được sử dụng';
        break;

      // P2000: The provided value for the column is too long for the column's type
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Dữ liệu nhập vào quá dài so với giới hạn';
        break;

      // P2011: Null constraint violation on the column
      case 'P2011':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Dữ liệu bắt buộc không được để trống';
        break;

      // P2014: The change you are trying to make would violate the required relation
      case 'P2014':
        statusCode = HttpStatus.CONFLICT;
        message = 'Thay đổi này vi phạm ràng buộc quan hệ duy nhất';
        break;

      // P2024: A constraint failed on the database
      case 'P2024':
        statusCode = HttpStatus.REQUEST_TIMEOUT;
        message = 'Hết thời gian chờ kết nối cơ sở dữ liệu';
        break;

      default:
        message = `Lỗi hệ thống Database (${exception.code})`;
        break;
    }

    const finalResponse: ResponseBase = {
      success: false,
      statusCode,
      message,
      errorFields,
      timstamp: new Date().toISOString(),
    };

    response.status(statusCode).json(finalResponse);
  }
}
