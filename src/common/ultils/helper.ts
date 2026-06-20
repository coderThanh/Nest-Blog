import { HttpStatus, INestApplication } from '@nestjs/common';

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
}: {
  statusCode: HttpStatus;
  url: string;
  method: string;
  message: string;
  stack?: string;
  body?: any;
}): string {
  let bodyMasked: Record<string, any> | undefined;

  if (body && typeof body === 'object') {
    bodyMasked = maskFieldObj(body, PAYLOAD_KEY_SECERT);
  }

  return `[${method}] ${statusCode} ${url} ${message}${bodyMasked ? `\nBody: ${JSON.stringify(bodyMasked)}` : ''}${stack ? `\n${stack}` : ''}`;
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
