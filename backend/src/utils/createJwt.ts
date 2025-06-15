import jwt from 'jsonwebtoken';

import { 
  JWT_EXPIRE_TIME_MS, 
  JWT_REFRESH_EXPIRE_TIME_MS, 
  JWT_SECRET 
} from '../constants';
import { decodeJwt } from './decodeJwt';

import type { JwtPayload } from '../config/passport';
import type { SafeUser } from '@homekeeper/shared';

export function createAuthToken(user: SafeUser): string {
  const payload: JwtPayload = {
    email: user.email,
    id: user.id,
    expiration: Date.now() + JWT_EXPIRE_TIME_MS,
    type: 'user',
  };

  return jwt.sign(payload, JWT_SECRET);
}

export function createRefreshToken(user: SafeUser): string {
  const refreshPayload: JwtPayload = {
    id: user.id,
    expiration: Date.now() + JWT_REFRESH_EXPIRE_TIME_MS,
    type: 'refresh',
  };

  return jwt.sign(refreshPayload, JWT_SECRET);
}

export function updateTokenExpiration(tokenPayload: JwtPayload | string) {
  if(typeof tokenPayload === 'string') {
    tokenPayload = decodeJwt(tokenPayload);
  }

  const expireTime = tokenPayload.type === 'refresh' ? JWT_REFRESH_EXPIRE_TIME_MS : JWT_EXPIRE_TIME_MS;
  tokenPayload.expiration = Date.now() + expireTime;

  return jwt.sign(tokenPayload, JWT_SECRET);
}