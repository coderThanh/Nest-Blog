import { Transform } from 'class-transformer';

// string to String[] default normalize
export function SplitToArray(separator: string) {
  return Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return value
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item !== '');
    }

    return value;
  });
}

// string to int[] should throw error
export function SplitToArrayNumber(separator: string, normalize: boolean) {
  const fnFilter = (item: any): boolean => {
    // default remove empty string
    return item !== '' && (normalize ? !isNaN(Number(item)) : true);
  };

  return Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return (
        value
          .split(separator)
          .map((item) => item.trim())
          // Lọc bỏ chuỗi rỗng và đảm bảo phần tử đó phải convert được thành số hợp lệ
          .filter(fnFilter)
          .map((item) => Number(item))
      );
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : item))
        .filter(fnFilter)
        .map((item) => Number(item));
    }

    return value;
  });
}
