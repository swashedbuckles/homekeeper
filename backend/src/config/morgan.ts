import morgan from 'morgan';

import { removeKeysReducer } from '../utils/removeKeys';

import type { Request, Response } from 'express';
import type { Options } from 'morgan';

/**
 * The `safe-body` token represents the request body
 * with privacy/security elements redacted for logging
 */
morgan.token('safe-body', (req: Request): string => {
  if (!req.body || typeof req.body !== 'object') {
    return '-';
  }

  const toRedact = ['password', 'token', 'jwt', 'authorization'];
  const safeBody = removeKeysReducer(req.body, toRedact);

  return JSON.stringify(safeBody);
});

morgan.token('user-id', (req: Request): string => {
  return req.user?.id ?? 'anonymous';
});

export const morganFormat = (): string => {
  return process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
};

export const authLogFormat = [
  ':remote-addr',
  ':user-id',
  '":method :url"',
  ':status',
  ':response-time ms',
  '":user-agent"',
  'Body=:safe-body',
].join(' ');

export const morganConfig = (): Options<Request, Response> => {
  return {};
};

export const authMorganConfig = (): Options<Request, Response> => {
  return {
    skip: (req: Request) => !req.path.startsWith('/auth'),
  };
};
