import { Router, type Request, type Response } from 'express';
import { body as validateBody } from 'express-validator';

export const router = Router();

import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants';
import { requireAuth } from '../middleware/auth';
// import { isMemberOf } from '../middleware/memberOf';
import { handleValidation } from '../middleware/validation';

import { Household } from '../models/household';

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const {id: userId} = req.user;

  const membership = await Household.findByMember(userId);
  /** @todo do we want to strip out membership information her? */
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: membership,
    });
});

export interface HouseholdRequest {
  name: string;
  description?: string;
}

export interface HouseholdRequestParams {
  id?: string
}


router.post('/', 
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth, 
  async (req: Request<object, object, HouseholdRequest>, res: Response) => {
  const {id: userId} = req.user;
  const {name, description} = req.body;

  const house = await Household.createHousehold(name, userId, description);
  
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: house
    });
});

export type HouseReq = Request<HouseholdRequestParams, object, object>;

router.get('/:id', 
  requireAuth, 
  // isMemberOf,
  async (req: HouseReq, res: Response) => {

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

  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: house
    });
});

router.put('/:id', 
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth, 
  async (req: Request<HouseholdRequestParams, object, HouseholdRequest>, res: Response) => {

  const userId = req.user.id;
  const house = await Household.findById(req.params.id);
  
  if(!house) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  const isMember = house.hasMember(userId);
  const isOwner = house.ownerId.equals(new Types.ObjectId(userId));

  /** @todo role-based verification */
  if(!isMember) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  if(!isOwner) {
    res
      .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
    return;
  }

  const update: HouseholdRequest = { name: req.body.name };
  house.name = req.body.name;
  if(req.body.description) {
    update.description = req.body.description;
    house.description = req.body.description;
  }

  await house.updateOne(update).exec();

  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: house
    });
});

router.delete('/:id', requireAuth, async (req: HouseReq, res: Response) => {
  const userId = req.user.id;
  const house = await Household.findById(req.params.id);
  
  if(!house) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  const isMember = house.hasMember(userId);
  const isOwner = house.ownerId.equals( new Types.ObjectId(userId));

  /** @todo role-based verification */
  if(!isMember) {
    res
      .apiError(HTTP_STATUS.NOT_FOUND, 'Household not found');
    return;
  }

  if(!isOwner) {
    res
      .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
    return;
  }

  await house.deleteOne().exec();

  res
    .status(HTTP_STATUS.NO_CONTENT)
    .send();
});
