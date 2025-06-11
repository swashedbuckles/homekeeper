/// <reference types="vite/client" />
import type { ApiResponse } from "@homekeeper/shared";
import { ApiError } from "./types/apiError";

console.log('ENVORNMENT', import.meta.env);

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://homekeeper-api.tomseph.dev' 
  : 'http://localhost:4000';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

   const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    if(!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, 'Network Error',);
  }
}
