/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, type Request, type Response } from 'express';
import { body as validateBody } from 'express-validator';

import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants';
import { requireAuth, assertHasUser } from '../middleware/auth';
import { isMemberOf, assertHasHouse } from '../middleware/isMemberOf';
import { handleValidation } from '../middleware/validation';
import { Household } from '../models/household';

import type { HouseReqBody, IdParam } from '../types/apiRequests';

export const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  assertHasUser(req);
  const {id: userId} = req.user;

  const membership = await Household.findByMember(userId);
  /** @todo do we want to strip out membership information her? */
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: membership,
    });
});

router.post('/', 
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth, 
  async (req: Request<{}, {}, HouseReqBody>, res: Response) => {
    assertHasUser<typeof req>(req);

    const {id: userId} = req.user;
    const {name, description} = req.body;

    const household = await Household.createHousehold(name, userId, description);
    
    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: household
      });
});


router.get('/:id', 
  requireAuth, 
  isMemberOf,
  (req: Request<IdParam, {}, {}>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: req.household
      });
});

router.put('/:id', 
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth, 
  isMemberOf,
  async (req: Request<IdParam, object, HouseReqBody>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);
    
    const userId = req.user.id;
    const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));
    
    if(!isOwner) {
      res
        .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
      return;
    }

    const update: HouseReqBody = { name: req.body.name };
    if(req.body.description) {
      update.description = req.body.description;
    }

    await req.household.updateOne(update).exec();

    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: { /** @todo json representation for household */
          ownerId: req.household.ownerId,
          members: req.household.members,
          name: req.body.name,
          description: req.body.description ?? req.household.description,
        }
      });
});

router.delete('/:id', 
    requireAuth, 
    isMemberOf,
    async (req: Request<IdParam, object, object>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    const userId = req.user.id;
    const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));
    
    if(!isOwner) {
      res
        .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
      return;
    }

    await req.household.deleteOne().exec();

    // eslint-disable-next-line custom/enforce-api-response
    res
      .status(HTTP_STATUS.NO_CONTENT)
      .send();
});
