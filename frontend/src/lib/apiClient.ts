/// <reference types="vite/client" />
import type { ApiResponse } from "@homekeeper/shared";
import { ApiError } from "./types/apiError";

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://homekeeper-api.tomseph.dev' 
  : 'http://localhost:4000';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  console.log('[API REQ]:', endpoint);
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
      console.error('[API REQ]: response not ok');
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
      );
    }
    console.log('[API REQ]: response ok for: ', url);
    
    return await response.json();
  } catch (error) {
    console.error('[API REQ]: got an api error', error);
    if(error  instanceof SyntaxError) {
      return {};  // probably no body of response.
    }
    if (error instanceof ApiError) {
      throw error;
    }

    console.log('[API REQ]: not api error, throwing network error');
    throw new ApiError(0, 'Network Error');
  }
}
