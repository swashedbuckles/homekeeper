
import { Router, type Request, type Response } from 'express';
import { Types } from 'mongoose';

import { HTTP_STATUS } from '../../constants';
import { assertHasUser } from '../../middleware/auth';
import { assertHasHouse } from '../../middleware/isMemberOf';
import { User } from '../../models/user';

import type { IdParam } from '../../types/apiRequests';
import type { AddMemberRequest, HouseholdRoles, InviteRequest } from '@homekeeper/shared';

export const router = Router();

/**
 * Get everyone in a household
 */
export const getMembers = async (req: Request<IdParam, object, object>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  try {
    const members = await req.household.getMembers();

    res.apiSuccess({
      data: {
        memberCount: members.length,
        members,
      }
    });
  } catch (error) {
    console.error(error);
    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch members');
  }
};

/**
 * Add someone (who exists) to a household
 */
export const putMember = async (req: Request<IdParam, object, AddMemberRequest>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  if (!req.params.id) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
    return;
  }

  const { userId, role } = req.body;

  if (role === 'owner') {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
    return;
  }

  const id = new Types.ObjectId(userId);
  const alreadyAdded = req.household.members.some(member => member.equals(id));

  if (alreadyAdded) {
    res.apiError(HTTP_STATUS.CONFLICT, 'User already part of household');
    return;
  }

  await req.household.addMember(userId, role);

  res.apiSuccess({
    data: (await req.household.getMembers())
  });
};

export const getMemberById = async (req: Request, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  const user = await User.findById(req.params.userId);
  if (!user) {
    res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    return;
  }

  res.apiSuccess({
    data: {
      id: user._id.toString(),
      name: user.name,
      role: user.householdRoles.get(req.household._id.toString())
    }
  });
};

/**
 * Send an invitation to a member
 */
export const postInvitation = (req: Request<IdParam, object, InviteRequest>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  if (!req.params.id) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
    return;
  }

  const { email, name, role } = req.body;

  if (role === 'owner') {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
    return;
  }

  console.log('Sending invitation to: ', name, ' ', email);
  /** @todo stub until email service integration */
  res.status(HTTP_STATUS.ACCEPTED).send();
};

/** 
 * Change a user's role
 */
type RoleChangeReqBody = { role: HouseholdRoles };
type RoleChangeParams = { id: string; userId: string };
export const putMemberRole = async (req: Request<RoleChangeParams, object, RoleChangeReqBody>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  const { role } = req.body;
  const { userId } = req.params;

  if (role === 'owner') {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    return;
  }

  await user.addHouseholdRole(req.household._id.toString(), role);

  res.apiSuccess({
    data: {
      id: user._id.toString(),
      name: user.name,
      role,
    }
  });
};

/**
 * Remove a user from the household
 */
export const deleteMember = async (req: Request<RoleChangeParams, object, object>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    return;
  }

  await req.household.removeMember(userId);
  const members = await req.household.getMembers();

  res.apiSuccess({
    data: {
      memberCount: members.length,
      members
    }
  });
};
