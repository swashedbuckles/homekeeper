import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../constants';

/**
 * Validate authentication token
 * @route GET /auth/validate
 * @response {{ data: { valid: boolean } }} Token validation status
 */
export function getValidate(req: Request, res: Response) {
  // If we reach here, requireAuth middleware has already validated the token
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: { valid: true },
    });
}