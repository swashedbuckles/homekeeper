import { csrfCookie } from '../../config/cookies';
import { generateCSRFToken } from '../../middleware/csrf';

import type {Request, Response} from 'express';

/**
 * Get CSRF token for client-side requests
 * @route GET /auth/csrf-token
 * @response {{ csrfToken: string }} CSRF token and cookie
 */
export function getCsrfToken(_req: Request, res: Response) {
  const token = generateCSRFToken();

  // eslint-disable-next-line custom/enforce-api-response
  res
    .cookie('csrfToken', token, csrfCookie())
    .json({ csrfToken: token });
}