import { Transform } from 'class-transformer';

export function ToNumber(options: { each?: boolean } = {}) {
  return Transform(({ value }) => {
    if (value === null || value === undefined) return value;
    if (!options.each) return Number(value);
    if (!Array.isArray(value)) return value;

    return value
      .filter((item) => item !== undefined && item !== null && item !== '')
      .map((item) => Number(item));
  });
}
