import { type ApiResponse } from '@homekeeper/shared';

import type { NextFunction, Request, Response } from 'express';

const makeResponse = <T>(data: ApiResponse<T>): ApiResponse<T> => data;

/**
 * Adds `apiSuccess` and `apiError` to express response chain, allowing us to 
 * strictly type the API responses. 
 * 
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const apiResponseMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.apiSuccess = function<T>(data: ApiResponse<T>): Response {
    return this.json(makeResponse(data));
  };
  
  res.apiError = function(statusCode: number, error: string): Response {
    return this.status(statusCode).json(makeResponse({ error, statusCode }));
  };
  
  next();
};