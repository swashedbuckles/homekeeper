import type { ApiResponse } from './api-wrapper';
import type { SafeUser } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export type CsrfResponse = {
  csrfToken: string;
};

/** @todo update backend responses to match ApiResponse type schema */
export type AuthResponse = ApiResponse<SafeUser>;