export interface IQueryAttributes<T> {
  hostname: string;
  path: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: T;
  port?: number;
}

export interface IQueryHeaders {
  'Content-Type': string;
}

export interface IQueryParams {
  [key: string]: string;
}

export interface IQueryResponse<T, Code> {
  message: string;
  code: Code;
  data?: T;
}
