import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }) => {
    if ([true, 1, 'true', '1'].includes(value)) return true;

    if ([false, 0, 'false', '0'].includes(value)) return false;

    return value;
  });
}
