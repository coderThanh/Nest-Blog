import { INestApplication } from '@nestjs/common';
import { PAYLOAD_KEY_SECERT } from '@/common/constant/ultil';

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
  stack,
  body,
  errorFields,
}: {
  statusCode: string;
  url: string;
  method: string;
  message: string;
  stack?: string;
  body?: any;
  errorFields?: Record<string, any>;
}): string {
  let bodyMasked: Record<string, any> | undefined;

  if (body && typeof body === 'object') {
    bodyMasked = maskFieldObj(body, PAYLOAD_KEY_SECERT);
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

  return `[${method}] ${statusCode} ${url} ${message} ${logMeta ? `- Meta: ${JSON.stringify(logMeta)}` : ''}`;
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
