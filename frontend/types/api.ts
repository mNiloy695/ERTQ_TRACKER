export interface ApiMeta {
  page?: number;
  page_size?: number;
  total_pages?: number;
  total_records?: number;
  execution_time_ms?: number;
  source?: string;
  next?: string | null;
  previous?: string | null;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
  errors: ApiError[];
}
