export type ResponseBase<T = unknown> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T | null;
  errorFields?: Record<string, string>;
  timstamp: string;
};

export type ResponseRead<T> = ResponseBase<T>;

export type ResponseWrite<T> = ResponseBase<T>;

export type BaseFindAllData<T> = {
  items: T[];
  meta: {
    currentPage: number;
    nextPage: number | null;
    totalPage: number;
    totalItems: number;
  };
};
