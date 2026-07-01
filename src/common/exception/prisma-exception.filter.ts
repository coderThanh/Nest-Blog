import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigService } from '@nestjs/config';
import { ConfigUltils } from '@/common/utils/config.util';
import { Prisma } from '@prisma/client';
import { ReqUserEmbed } from '@/shared/entities/auth.entity';
import { ResponseBase } from '@/shared/types/response';
import { getLoggerMessage } from '@/common/utils/helper.util';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const log = new Logger('PrismaException');

    const { url, method, body } = request;
    const user = request.user as ReqUserEmbed;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorFields: ResponseBase['errorFields'] = undefined;

    const isDebug = new ConfigUltils(this.configService).getDebugCheck();

    if (isDebug) {
      console.error(
        `-- [${method}] ${url} PrismaClientExceptionFilter Chi tiết lỗi:`,
        exception?.code,
        exception?.meta?.driverAdapterError,
      );
    }

    switch (exception.code) {
      // P2002: Unique constraint failed
      case 'P2002': {
        statusCode = HttpStatus.CONFLICT;
        const targets = exception.meta?.target as string[];
        message = 'Dữ liệu đã trùng lặp trong hệ thống';
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
          (exception.meta?.cause as string) ||
          'Không tìm thấy bản ghi hoặc bản ghi quan hệ';
        break;

      // P2003: Foreign key constraint failed on the field
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message =
          'Liên kết với Primary Key không tồn tại hoặc đang bị ràng buộc';
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

    // Log
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      log.error(
        getLoggerMessage({
          statusCode: `${statusCode} ${exception.code}`,
          userId: user?.userId || null,
          url,
          message,
          method,
          stack: exception.stack || null,
          body,
          errorFields: errorFields ?? null,
        }),
      );
    } else {
      log.warn(
        getLoggerMessage({
          statusCode: `${statusCode} ${exception.code}`,
          userId: user?.userId || null,
          url,
          message,
          method,
          body,
          stack: exception.stack || null,
          errorFields: errorFields ?? null,
        }),
      );
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
