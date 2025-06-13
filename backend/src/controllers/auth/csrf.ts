import type {Request, Response} from 'express';
import { csrfCookie } from '../../config/cookies';
import { generateCSRFToken } from '../../middleware/csrf';

export function getCsrfToken(_req: Request, res: Response) {
  const token = generateCSRFToken();

  // eslint-disable-next-line custom/enforce-api-response
  res
    .cookie('csrfToken', token, csrfCookie())
    .json({ csrfToken: token });
}