export type ResponseBase<T = unknown> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T | null;
  errorFields?: Record<string, string>;
  timstamp: string;
};

export type ResponseRead<T = unknown> = ResponseBase<T>;

export type ResponseWrite<T = unknown> = ResponseBase<T>;

export type BaseFindAllData<T = unknown> = {
  items: T[];
  meta: FindAllDataMeta;
};

export type FindAllDataMeta = {
  currentPage: number;
  nextPage: number | null;
  totalPage: number;
  totalItems: number;
  limit: number;
};
