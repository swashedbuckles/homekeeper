import { validationResult } from 'express-validator';

import { HTTP_STATUS } from '../constants';

import type { NextFunction, Request, Response } from 'express';

/**
 * Inspect the request for errors from express-validaiton and 
 * throw an error if any exist.
 * 
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns 
 */
export const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    errors.array().forEach((error, index, array) => {
      console.log(`[VALIDATION ERROR (${index} of ${array.length})]: ${error.type}`, error.msg);
    });
    /** @todo conform to API Error Response Types */
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Invalid input',
      details: errors.array(),
    });

    return;
  }

  next();
};