/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, type Request, type Response } from 'express';
import { Types } from 'mongoose';

import { HTTP_STATUS } from '../../constants';
import { assertHasUser } from '../../middleware/auth';
import { assertHasHouse } from '../../middleware/isMemberOf';
import { Household } from '../../models/household';
import { removeKeysReducer } from '../../utils/removeKeys';

import type { HouseReqBody, IdParam } from '../../types/apiRequests';
import type { HouseResponse } from '@homekeeper/shared';

export const router = Router();

/**
 * Returns a list of households of which user is a member. 
 * Looked up via household and not by User's role-map
 */
export const getHouseholds = async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id: userId } = req.user;

  try {
    const membership = await Household.findByMember(userId);
    const data = membership.map(house => {

      const data: HouseResponse = {
        memberCount: house.members.length,
        userRole: req.user.householdRoles[house._id.toString()],
        ...removeKeysReducer(house.serialize(), ['members'])
      };

      return data;
    });

    /** @todo currently all roles have household_view, but if we ever have a role that can't view household... */
    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data,
      });
  } catch (e) {
    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON.stringify(e));
  }
};

/** 
 * Household creation doesn't have permissions as... you become the owner once you've created one.
 */
export const postHouseholds = async (req: Request<{}, {}, HouseReqBody>, res: Response) => {
  assertHasUser<typeof req>(req);

  const { id: userId } = req.user;
  const { name, description } = req.body;

  try {
    const household = await Household.createHousehold(name, userId, description);

    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: household
      });
  } catch (e) {
    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON.stringify(e));
  }
};

/**
 * Get details for an individual household
 */
export const getHouseholdById = (req: Request<IdParam, {}, {}>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: req.household
    });
};

/**
 * Update a household
 */
export const putHousehold = async (req: Request<IdParam, object, HouseReqBody>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  const userId = req.user.id;
  const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));

  if (!isOwner) {
    res
      .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
    return;
  }

  const update: HouseReqBody = { name: req.body.name };
  if (req.body.description) {
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
};

/**
 * Remove a household!
 */
export const deleteHousehold = async (req: Request<IdParam, object, object>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  const userId = req.user.id;
  const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));

  if (!isOwner) {
    res
      .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
    return;
  }

  await req.household.deleteOne().exec();

  // eslint-disable-next-line custom/enforce-api-response
  res
    .status(HTTP_STATUS.NO_CONTENT)
    .send();
};
