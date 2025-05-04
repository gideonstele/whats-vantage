/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CommonResponseType<D, E = Error> {
  success: boolean;
  message?: string;
  error?: E;
  data?: D;
}

export interface ListResponseType<D, E> {
  success: boolean;
  message?: string;
  total?: number;
  data?: D[];
  error?: E;
}

export interface SoryByOptions<T extends string> {
  field: T;
  order: 'asc' | 'desc';
}

export interface SearchByOptions<D extends Record<string, any>> {
  key: keyof D;
  search: any;
}
