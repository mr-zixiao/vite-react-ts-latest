export interface ApiResponseBasic {
  code: number;
  error: boolean;
  success: boolean;
  msg: string;
}

export interface ApiDataResponse<T> extends ApiResponseBasic {
  data: T;
}

export interface ApiRowsResponse<T> extends ApiResponseBasic {
  rows: T;
  total: number;
}
