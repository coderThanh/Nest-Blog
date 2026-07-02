import { Transform } from 'class-transformer';

export function ToNullable() {
  return Transform(({ value }) => {
    if (value === 'null' || value === 'NULL') return null;

    return value;
  });
}
