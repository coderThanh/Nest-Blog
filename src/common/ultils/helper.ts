import { INestApplication } from '@nestjs/common';

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
