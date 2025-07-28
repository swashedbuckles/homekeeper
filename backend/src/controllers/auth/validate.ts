import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../constants';

export function getValidate(req: Request, res: Response) {
  // If we reach here, requireAuth middleware has already validated the token
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: { valid: true },
    });
}