import { HTTP_STATUS } from '../constants';
import { Household } from '../models/household';

import type { HouseReq } from '../routes/household';
import type { Response, NextFunction} from 'express';


export const isMemberOf = async (req: HouseReq, res: Response, next: NextFunction ): Promise<void> => {
  const userId = req.user.id;
  const house = await Household.findById(req.params.id);
  
  if(!house) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  const isMember = house.hasMember(userId);

  /** @todo role-based verification */
  if(!isMember) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  next();
};
