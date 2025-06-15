import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants';

import type { JwtPayload } from '../config/passport';

export function decodeJwt(token: string): JwtPayload {
  const result = jwt.verify(token, JWT_SECRET);

  if (typeof result === 'string') {
    return JSON.parse(result) as JwtPayload;
  }

  return result as unknown as JwtPayload;
}