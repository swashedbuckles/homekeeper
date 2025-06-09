// Generic API response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T | T[];
  message?: string;
  error?: string;
  statusCode?: number;
}

// Error response
export interface ApiError extends ApiResponse<null> {
  success: false;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}