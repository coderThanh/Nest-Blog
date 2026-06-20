import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ApiResponseOkDto } from '@/shared/dto';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseOkInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseOkDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseOkDto<T>> {
    // Lấy đối tượng HTTP response gốc từ Express/Fastify
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Lấy statusCode động (ví dụ: GET -> 200, POST -> 201)
        const statusCode = response.statusCode;

        // Nếu dữ liệu đã được bọc đúng cấu trúc trước đó, giữ nguyên
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return data;
        }

        // Bọc dữ liệu với mã statusCode động vừa lấy được
        return new ApiResponseOkDto(statusCode, data);
      }),
    );
  }
}
