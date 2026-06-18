import { Transform } from 'class-transformer';

export function SplitToArray(separator: string, normalize: boolean = true) {
  return Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      if (!normalize) return value.split(separator);

      return value
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item !== '');
    }

    return value;
  });
}

export function SplitToArrayNumber(separator: string) {
  return Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return (
        value
          .split(separator)
          .map((item) => item.trim())
          // Lọc bỏ chuỗi rỗng và đảm bảo phần tử đó phải convert được thành số hợp lệ
          .filter((item) => item !== '' && !isNaN(Number(item)))
          .map((item) => Number(item))
      );
    }

    if (Array.isArray(value)) {
      return value.map((item) => Number(item)).filter((item) => !isNaN(item));
    }

    return value;
  });
}
