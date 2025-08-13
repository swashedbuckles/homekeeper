import { apiRequest } from '../apiClient';
import { cacheHelpers } from '../util/cacheHelpers';
import type { SafeUser } from '@homekeeper/shared';

export function login(email: string, password: string) {
  return apiRequest<SafeUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
  }).then(response => {
    cacheHelpers.clearAllCaches();
    return response;
  });
}

export function register(email: string, password: string, name: string) {
  return apiRequest<SafeUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
  }).then(response => {
    cacheHelpers.clearAllCaches();
    return response;
  });
}

export function logout() {
    return apiRequest('/auth/logout', { method: 'POST' }).then(response => {
      cacheHelpers.clearAllCaches();
      return response;
    });
}


export function getProfile() {
  return apiRequest<SafeUser>('/auth/whoami');
}

export function validateSession() {
  return apiRequest('/auth/validate');
}
