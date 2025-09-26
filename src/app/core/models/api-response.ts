export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

