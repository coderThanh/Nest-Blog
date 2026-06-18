export type ResponseBase<T = unknown> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T | null;
  errorFields?: Record<string, string>;
};

export type ResponseRead<T> = ResponseBase<T>;

export type ResponseWrite<T> = ResponseBase<T>;
