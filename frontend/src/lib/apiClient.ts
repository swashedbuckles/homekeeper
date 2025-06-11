/// <reference types="vite/client" />
import type { ApiResponse } from "@homekeeper/shared";
import { ApiError } from "./types/apiError";
import { API as logger } from '../lib/logger';

let csrfToken: string|null = null;

const CSRF_HEADER = 'X-CSRF-TOKEN'; /** @todo extract into shared if it's not already */
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/csrf-token', '/auth/logout'];

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://homekeeper-api.tomseph.dev' 
  : 'http://localhost:4000';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  logger.log('[API REQ]:', endpoint);
  const url = `${API_BASE_URL}${endpoint}`;
  
  const noCsrfToken = !csrfToken;
  const routeNeedsCsrf = needsCSRF(endpoint, options.method ?? 'GET');

  if(routeNeedsCsrf && noCsrfToken) {
    logger.log('[API REQ]: Need token and no token');
    try {
      csrfToken = await getCsrfToken();
      logger.log('[API REQ]: GOT TOKEN:', csrfToken);
    } catch (error) {
      logger.error('[API REQ]: Error fetching CSRF Token: ', error);
      throw error;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if(routeNeedsCsrf && csrfToken) {
    logger.log('[API REQ]: Adding token to headers');
    headers[CSRF_HEADER] = csrfToken;
  };

   const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: 'include',
  };


  try {
    const response = await fetch(url, config);
    if(!response.ok) {
      logger.error('[API REQ]: response not ok');
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
      );
    }
    logger.log('[API REQ]: response ok for: ', url);
    
    return await response.json();
  } catch (error) {
    logger.error('[API REQ]: got an api error', error);
    if(error  instanceof SyntaxError) {
      return {};  // probably no body of response.
    }
    if (error instanceof ApiError) {
      throw error;
    }

    logger.log('[API REQ]: not api error, throwing network error');
    throw new ApiError(0, 'Network Error');
  }
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: 'include'
  });
  const data = await response.json();
  return data.csrfToken;
};

export function clearCsrfToken(): void {
  csrfToken = '';
}

function needsCSRF(endpoint: string, method: string): boolean {
  const isProtectedMethod = CSRF_PROTECTED_METHODS.includes(method.toUpperCase());
  const isAuthEndpoint = AUTH_ENDPOINTS.some(path => endpoint.startsWith(path))
  
  return isProtectedMethod && !isAuthEndpoint;
}