import { HTTP_STATUS } from '../constants';
import { Household } from '../models/household';

import type { Request, Response, NextFunction } from 'express';

/**
 * Assert that `req.household` exists on the request object -- primarily for 
 * Typescript to understand mutations occurring in middleware
 * @param req Request object
 */
export function assertHasHouse<T extends Request>(req: T): asserts req is T & { household: NonNullable<Express.Request['household']> } {
  if (!req.household) {
    throw new Error('User is not a member of household');
  }
}

/**
 * Middleware to user membership in a given household
 * 
 * @requires Auth Middleware 
 * @param req Request object
 * @param res Response
 * @param next Next function
 */
export const isMemberOf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    next();
    return;
  }

  const userId = req.user.id;
  try {
    const household = await Household.findById(req.params.id);
    if (!household) {
      res
        .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
      return;
    }

    const isMember = household.hasMember(userId);

    /** @todo role-based verification */
    if (!isMember) {
      res
        .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
      return;
    }

    req.household = household;
    next();
  } catch (error) {
    console.error('Error finding household for isMemberOf', error);
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }


};
