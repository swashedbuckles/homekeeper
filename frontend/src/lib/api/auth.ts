import type { SafeUser } from "@homekeeper/shared";
import { apiRequest } from "../api-client";

export function login(email: string, password: string) {
  return apiRequest<SafeUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string, name: string) {
  return apiRequest<SafeUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
  });
}

export function logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
}


export function getProfile() {
  return apiRequest<SafeUser>('/auth/whoami');
}
