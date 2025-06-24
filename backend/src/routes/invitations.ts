/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router } from 'express';
import { body as validateBody } from 'express-validator';

import { HTTP_STATUS } from '../constants';
import { assertHasUser, requireAuth } from '../middleware/auth';
import { handleValidation } from '../middleware/validation';
import { Household } from '../models/household';
import { Invitation } from '../models/invitation';

import type { RedeemInvitationRequest, RedeemResponse } from '@homekeeper/shared';
import type { Request, Response } from 'express';

export const router = Router();

// not inlined in method call in case I want to pull it out to controllers later
export const postRedeem = async (req: Request<{}, {}, RedeemInvitationRequest>, res: Response) => {
  assertHasUser<typeof req>(req);
  const invitation = await Invitation.findOne({ code: req.body.code });
  if (!invitation || !invitation.isValid()) {
    res.apiError(HTTP_STATUS.NOT_FOUND, 'Invitation missing or expired');
    return;
  }

  const household = await Household.findById(invitation.householdId);

  if (!household) {  // shouldn't happen, but if household gets removed...
    res.apiError(HTTP_STATUS.CONFLICT, 'Invitation is invalid');
    return;
  }

  /** @todo transactions! */
  await household.addMember(req.user.id, invitation.role);
  await invitation.redeem();


  res.apiSuccess<RedeemResponse>({
    message: 'Successfully joined household',
    data: {
      householdId: household._id.toString(),
      householdName: household.name,
      role: invitation.role
    }
  });
};

router.post('/redeem',
  validateBody('code').isString().trim().isLength({ max: 6, min: 6 }),
  handleValidation,
  requireAuth,
  postRedeem
);