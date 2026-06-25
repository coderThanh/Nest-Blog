import { MAX_LENGTH_NAME } from '@/common/constant/ultil';
import { MaxLength } from 'class-validator';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { applyDecorators } from '@nestjs/common';

/**
 * Decorator custom kiểm tra độ dài tối đa, tự động tích hợp message chuẩn hóa.
 * @param maxLength Số ký tự tối đa cho phép
 */
export function IsMaxLength(maxLength: number = MAX_LENGTH_NAME) {
  return applyDecorators(
    MaxLength(maxLength, {
      // Tự động map message dựa trên tham số truyền vào
      message: ValidateMessage.maxLength(maxLength).exceptionMsg(),
    }),
  );
}
