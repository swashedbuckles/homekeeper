import { csrfCookie } from '../../config/cookies';
import { generateCSRFToken } from '../../middleware/csrf';

import type {Request, Response} from 'express';

/**
 * Get CSRF token for client-side requests
 * @route GET /auth/csrf-token
 * @response {{ data: { csrfToken: string } }} CSRF token and cookie
 */
export function getCsrfToken(_req: Request, res: Response) {
  const token = generateCSRFToken();

  res
    .cookie('csrfToken', token, csrfCookie())
    .apiSuccess({
      data: { csrfToken: token }
    });
}