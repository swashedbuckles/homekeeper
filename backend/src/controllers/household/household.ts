/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, type Request, type Response } from 'express';
import { Types } from 'mongoose';

import { HTTP_STATUS } from '../../constants';
import { assertHasUser } from '../../middleware/auth';
import { assertHasHouse } from '../../middleware/isMemberOf';
import { Household, HouseholdDocument } from '../../models/household';
import { removeKeysReducer } from '../../utils/removeKeys';

import type { HouseReqBody, IdParam } from '../../types/apiRequests';
import type { HouseholdRoles, HouseResponse } from '@homekeeper/shared';

export const router = Router();

export const transformHousehold = (userRoles: { [key: string]: HouseholdRoles }) => (house: HouseholdDocument) => {
  const data: HouseResponse = {
    memberCount: house.members.length,
    userRole: userRoles[house._id.toString()],
    ...removeKeysReducer(house.serialize(), ['members'])
    
  };

  return data;
};

/**
 * Get all households where user is a member
 * @route GET /household
 * @response {{ data: HouseResponse[] }} List of households with user roles
 */
export const getHouseholds = async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id: userId } = req.user;

  try {
    const membership = await Household.findByMember(userId);
    const data = membership.map(transformHousehold(req.user.householdRoles));
    
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
 * Create a new household
 * @route POST /household
 * @body {HouseReqBody} Household data (name, description?)
 * @response {{ data: object }} Created household data
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
        data: household.serialize()
      });
  } catch (e) {
    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON.stringify(e));
  }
};

/**
 * Get household details by ID
 * @route GET /household/:id
 * @params {IdParam} Household ID
 * @response {{ data: HouseResponse }} Household details with user role
 */
export const getHouseholdById = (req: Request<IdParam, {}, {}>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      data: transformHousehold(req.user.householdRoles)(req.household)
    });
};

/**
 * Update household information
 * @route PUT /household/:id
 * @params {IdParam} Household ID
 * @body {HouseReqBody} Updated household data (name, description?)
 * @response {{ data: object }} Updated household data
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

  // Apply updates to the document and use consistent serialization
  Object.assign(req.household, update);
  const data = transformHousehold(req.user.householdRoles)(req.household);
  
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({data});
};

/**
 * Delete a household
 * @route DELETE /household/:id
 * @params {IdParam} Household ID
 * @response No content (204)
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
