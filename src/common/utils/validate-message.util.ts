import { ValidationArguments } from 'class-validator';

class ValidateMessageBuilder {
  constructor(private readonly message: string) {}

  rawMsg() {
    return this.message;
  }

  exceptionMsg() {
    return (args: ValidationArguments) => `${args.property}-${this.message}`;
  }
}

export class ValidateMessage {
  private static buildMessage(message: string, name: string) {
    const text = name
      ? `${name} ${message}`
      : message.charAt(0).toUpperCase() + message.slice(1);

    return new ValidateMessageBuilder(text);
  }

  static isString(name: string = '') {
    return this.buildMessage('phải là chuỗi', name);
  }

  static isRequired(name: string = '') {
    return this.buildMessage('không được để trống', name);
  }

  static isNotEmpty(name: string = '') {
    return this.isRequired(name);
  }

  static isNumber(name: string = '') {
    return this.buildMessage('phải là số', name);
  }

  static isInt(name: string = '') {
    return this.buildMessage('phải là số nguyên', name);
  }

  static isBoolean(name: string = '') {
    return this.buildMessage('phải là true hoặc false', name);
  }

  static isEmail(name: string = '') {
    return this.buildMessage('không đúng định dạng email', name);
  }

  static isPhone(name: string = '') {
    return this.buildMessage('không đúng định dạng số điện thoại', name);
  }

  static isStrongPassword(name: string = '') {
    return this.buildMessage(
      'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
      name,
    );
  }

  static isRepeatMatch(name: string = '') {
    return this.buildMessage('nhập lại không trùng khớp', name);
  }

  static isEnum(enums: string = '', name: string = '') {
    return this.buildMessage(
      `không hợp lệ${enums ? ` giá trị phải nằm trong ${enums}` : ''}`,
      name,
    );
  }

  static isArray(name: string = '') {
    return this.buildMessage('phải là danh sách', name);
  }

  static isArrayNumber(name: string = '') {
    return this.buildMessage('phải là danh sách chứa số', name);
  }

  static isArrayInt(name: string = '') {
    return this.buildMessage('phải là danh sách chứa số nguyên', name);
  }

  static isArrayString(name: string = '') {
    return this.buildMessage('phải là danh sách chứa chuỗi', name);
  }

  static isDateString(name: string = '') {
    return this.buildMessage('không đúng định dạng ngày tháng', name);
  }

  static isTimeString(name: string = '') {
    return this.buildMessage('không đúng định dạng thời gian', name);
  }

  static isUrl(name: string = '') {
    return this.buildMessage('không đúng định dạng URL', name);
  }

  static isNotSefl(name: string = '') {
    return this.buildMessage('không được phép trùng với chính bảng ghi', name);
  }

  static min(min: number, name: string = '') {
    return this.buildMessage(`phải lớn hơn hoặc bằng ${min}`, name);
  }

  static max(max: number, name: string = '') {
    return this.buildMessage(`phải nhỏ hơn hoặc bằng ${max}`, name);
  }

  static minLength(minLength: number, name: string = '') {
    return this.buildMessage(`phải có ít nhất ${minLength} ký tự`, name);
  }

  static maxLength(maxLength: number, name: string = '') {
    return this.buildMessage(`không được vượt quá ${maxLength} ký tự`, name);
  }

  static arrayMinSize(minSize: number, name: string = '') {
    return this.buildMessage(`phải có ít nhất ${minSize} phần tử`, name);
  }

  static arrayMaxSize(maxSize: number, name: string = '') {
    return this.buildMessage(`không được vượt quá ${maxSize} phần tử`, name);
  }

  static someNotFound(name: string = '') {
    return this.buildMessage(
      `một hoặc nhiều phần tử đã không còn tồn tại`,
      name,
    );
  }

  static notFound(name: string = '') {
    return this.buildMessage(`bảng ghi không tồn tại`, name);
  }

  static notFoundUser(name: string = '') {
    return this.buildMessage(`người dùng không tồn tại`, name);
  }

  static notFoundToken(name: string = '') {
    return this.buildMessage(`token không tồn tại hoặc đã hết hạn`, name);
  }

  static unauthorized(name: string = '') {
    return this.buildMessage(`token không hợp lệ hoặc đã hết hạn`, name);
  }

  static forbidden(name: string = '') {
    return this.buildMessage(
      `bạn không có quyền thực hiện hành động này`,
      name,
    );
  }

  static loginFaild(name: string = '') {
    return this.buildMessage('sai tên đăng nhập hoặc mật khẩu', name);
  }

  static matches(example: string = '', name: string = '') {
    return example
      ? this.buildMessage(`không đúng định dạng. Ví dụ: ${example}`, name)
      : this.buildMessage('không đúng định dạng', name);
  }

  static wasExisted(name: string = '') {
    return this.buildMessage(`đã tồn tại`, name);
  }

  static isUnique(name: string = '') {
    return this.buildMessage('đã tồn tại', name);
  }

  static isConnectingNotDelete(name: string = '') {
    return this.buildMessage('vẫn còn bảng ghi liên kết không thể xoá', name);
  }

  static isSystemDoNotEdit(name: string = '') {
    return this.buildMessage(
      'đây là bảng ghi hệ thống không được phép sửa',
      name,
    );
  }

  static isSystemDoNotDelete(name: string = '') {
    return this.buildMessage(
      'đây là bảng ghi hệ thống không được phép xoá',
      name,
    );
  }

  // return array to connact with errors class-validator handle at all-exception-filter
  static exceptionThrowErrorsField(field: string, message: string) {
    return [`${field}-${message}`];
  }
}
