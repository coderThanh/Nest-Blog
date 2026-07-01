import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

import { INestApplication } from '@nestjs/common';
import { PAYLOAD_KEY_SECERT } from '@/common/constant/util';
import { v7 as uuidv7 } from 'uuid';

// npm i google-libphonenumber
// npm i -D @types/google-libphonenumber
const phoneUtil = PhoneNumberUtil.getInstance();

export function isPhoneNumber(
  phoneNumber: string,
  countryCode: string = 'VN',
): boolean {
  try {
    const parsedPhone = phoneUtil.parseAndKeepRawInput(
      phoneNumber,
      countryCode,
    );
    return phoneUtil.isValidNumberForRegion(parsedPhone, countryCode);
  } catch (err) {
    return false;
  }
}

export function formatToPhoneE164(
  phone: string,
  countryCode: string = 'VN',
): string {
  if (!phone) return phone;

  const parsedNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);
  return phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
  // Kết quả luôn là: +84912345678
}

export function toBoolean(input: any): boolean | null {
  if (['1', 1, true, 'true'].includes(input)) return true;

  if (['0', 0, false, 'false'].includes(input)) return false;

  return null;
}

export async function getUrl(app: INestApplication): Promise<string> {
  let url = await app.getUrl();
  url = url.replace('[::1]', 'localhost');
  return url;
}

export function getLoggerMessage({
  statusCode,
  url,
  method,
  message,
  userId,
  stack,
  body,
  errorFields,
}: {
  statusCode: string;
  url: string;
  method: string;
  message: string;
  userId: string | null;
  stack: string | null;
  body: any;
  errorFields: Record<string, any> | null;
}): string {
  const log: Record<string, any> = {
    request: {
      method,
      url,
    },
    exception: {
      statusCode,
      message,
    },
  };

  //
  let bodyMasked: Record<string, any> | undefined;

  if (body && typeof body === 'object') {
    bodyMasked = maskFieldObj(body, PAYLOAD_KEY_SECERT);
  }

  if (userId) {
    log.user = {
      userId,
    };
  }

  // Gom toàn bộ context động vào meta object
  const logMeta =
    bodyMasked || errorFields || stack
      ? {
          body: bodyMasked,
          errorFields,
          stack,
        }
      : undefined;

  if (logMeta) {
    log.meta = logMeta;
  }

  return JSON.stringify(log);
}

export function maskFieldObj(obj: any, secrets: string[]): any {
  if (!obj || typeof obj !== 'object' || !secrets.length) return obj;

  const cloned = { ...obj };

  for (const key in cloned) {
    if (secrets.includes(key)) {
      cloned[key] = '**';
    }
  }

  return cloned;
}

export const removeVietnameseAccents = (
  str: string | null | undefined,
): string => {
  if (typeof str !== 'string') return '';
  if (str === '') return '';
  // str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  // str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  // str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  // str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  // str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  // str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  // str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  // str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  // str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  // str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  // str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  // str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  // str = str.replace(/đ/g, 'd')
  // str = str.replace(/Đ/g, 'D')

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// npm i uuid
export const cuid = () => uuidv7();
