import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ApiResponseOkDto<T> {
  @ApiProperty({ example: 200, description: 'Mã trạng thái HTTP Response' })
  statusCode: number;

  @ApiProperty({ example: 'Thành công', description: 'Thông báo kèm theo' })
  message: string;

  @ApiProperty({ example: 'true', description: 'API thành công' })
  success: boolean;

  @ApiProperty({
    example: '2026-06-13T09:00:00.000Z',
    description: 'Thời gian phản hồi',
  })
  timestamp: string;

  @ApiProperty() // Thêm decorator này để Swagger nhận diện field
  // Data giữ nguyên kiểu Generic T
  data: T;

  constructor(statusCode: HttpStatus, data: T, message = 'Thành công') {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.data = data;
  }
}

export class ResponseFindAllData<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  meta: ApiResponseDataFindAllMeta | ResponseFindAllDataMetaCursor<any>;

  constructor(payload: ResponseFindAllData<T>) {
    Object.assign(this, payload);
  }
}

export class ApiResponseDataFindAllMeta {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  nextPage: number | null;

  @ApiProperty()
  totalPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  limit: number;

  constructor(payload: ApiResponseDataFindAllMeta) {
    Object.assign(this, payload);
  }
}

export class ResponseFindAllDataMetaCursor<T extends string | number> {
  @ApiProperty()
  lastCursor: T;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  limit: number;

  constructor(payload: ResponseFindAllDataMetaCursor<T>) {
    Object.assign(this, payload);
  }
}
