export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface ApiListResponse<T> extends ApiResponse<PageResponse<T>> {}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiQueryParams {
  [key: string]: boolean | number | string | ReadonlyArray<boolean | number | string> | null | undefined;
}

export interface ApiRequestOptions {
  params?: ApiQueryParams;
  trackLoading?: boolean;
  responseType?: 'json' | 'text';
}

export interface MockRequestOptions {
  delayMs?: number;
  message?: string;
  shouldFail?: boolean;
  failureMessage?: string;
  failureStatus?: number;
  trackLoading?: boolean;
}

export interface ApiRequestState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function createInitialRequestState<T>(data: T | null = null): ApiRequestState<T> {
  return {
    data,
    error: null,
    loading: false
  };
}

export class AppHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppHttpError';
  }
}
