import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants';

/**
 * Inspect the request for errors from express-validaiton and 
 * throw an error if any exist.
 * 
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns 
 */
export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    /** @todo conform to API Error Response Types */
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Invalid input',
      details: errors.array(),
    });

    return;
  }

  next();
};