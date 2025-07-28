/// <reference types="vite/client" />

import { API as logger } from '../lib/logger';
import { ApiError } from './types/apiError';
import type { Nullable } from './types/nullable';
import type { ApiResponse } from '@homekeeper/shared';

const CSRF_HEADER            = 'X-CSRF-TOKEN'; /** @todo extract into shared if it's not already */
const AUTH_ENDPOINTS         = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/csrf-token', '/auth/logout'];
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://homekeeper-api.tomseph.dev' 
  : 'http://localhost:4000';

let csrfToken: string|null = null;
const isApiError = (val: unknown): val is ApiError => val instanceof ApiError;

export async function refreshJwt(): Promise<Nullable<Response>> {
  logger.log('REFRESHING JWT TOKEN');
  const url = `${API_BASE_URL}/auth/refresh`;
  const response = await fetch(url, {method: 'POST', credentials: 'include'});
  if (response.status === 205) {
    /** @todo clear auth state, redirect to login */
    throw new ApiError(205, 'Session expired, please log in again');
  }

  if (!response.ok) {
    throw new ApiError(response.status, 'Refresh failed');
  }

  return response;
}

export async function makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    return await invokeFetch(url, options);
  } catch (error) {
    if(needsJWT(url) && isApiError(error) && error.statusCode === 401) {
      await refreshJwt();
      return await invokeFetch(url, options);
    }

    throw error;
  }
}

export function invokeFetch(url: string, config: RequestInit): Promise<Response> {
  return fetch(url, config)
    .then(async response => {
        if(!response.ok) {
          logger.error('[API REQ]: response not ok for: ', url);
          const errorData = await response.json().catch(() => ({}));
          
          throw new ApiError(
            response.status,
            errorData.error || `HTTP ${response.status}`,
          );
        }

        return response;
    });
}

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
    const response = await makeRequest(url, config);
    logger.log('[API REQ]: response ok for: ', url);
    
    return await response.json();
  } catch (error) {
    logger.error('[API REQ]: got an api error', error);
    if(error  instanceof SyntaxError) {
      return {};  // probably no body of response.
    }
    if (isApiError(error)) {
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

function needsJWT(url: string): boolean {
  // Extract the path from the full URL
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const isAuthEndpoint = AUTH_ENDPOINTS.some(authPath => path.startsWith(authPath));
    return !isAuthEndpoint;
  } catch {
    // If URL parsing fails, assume it's already a path
    const isAuthEndpoint = AUTH_ENDPOINTS.some(authPath => url.startsWith(authPath));
    return !isAuthEndpoint;
  }
}

function needsCSRF(endpoint: string, method: string): boolean {
  const isProtectedMethod = CSRF_PROTECTED_METHODS.includes(method.toUpperCase());
  const isAuthEndpoint = AUTH_ENDPOINTS.some(path => endpoint.startsWith(path));
  
  return isProtectedMethod && !isAuthEndpoint;
}