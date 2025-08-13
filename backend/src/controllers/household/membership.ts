
import { INVITATION_STATUS, type AddMemberRequest, type HouseholdRoles, type InvitationResponse, type InviteRequest } from '@homekeeper/shared';
import { Router, type Request, type Response } from 'express';
import { Types } from 'mongoose';

import { HTTP_STATUS } from '../../constants';
import { assertHasUser } from '../../middleware/auth';
import { assertHasHouse } from '../../middleware/isMemberOf';
import { Invitation } from '../../models/invitation';
import { User } from '../../models/user';

import type { IdParam } from '../../types/apiRequests';

export const router = Router();

/**
 * Get all members of a household
 * @route GET /household/:id/members
 * @params {IdParam} Household ID
 * @response {{ data: { memberCount: number, members: MemberDetail[] } }} Household members list
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
 * Add existing user to household
 * @route PUT /household/:id/members
 * @params {IdParam} Household ID
 * @body {AddMemberRequest} User ID and role to add
 * @response {{ data: MemberDetail[] }} Updated members list
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
  
  const members = await req.household.getMembers();
  res.apiSuccess({
    data: {
      memberCount: members.length,
      members
    }
  });
};

/**
 * Get specific household member details
 * @route GET /household/:id/member/:userId
 * @params {{ id: string, userId: string }} Household ID and user ID
 * @response {{ data: { id: string, name: string, role: HouseholdRoles } }} Member details
 */
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
      email: user.email,
      role: user.householdRoles.get(req.household._id.toString())
    }
  });
};

type RoleChangeReqBody = { role: HouseholdRoles };
type HouseAndUserParams = { id: string; userId: string };
/** 
 * Update household member's role
 * @route PUT /household/:id/members/:userId/role
 * @params {HouseAndUserParams} Household ID and user ID
 * @body {RoleChangeReqBody} New role for the user
 * @response {{ data: { id: string, name: string, role: HouseholdRoles } }} Updated member details
 */
export const putMemberRole = async (req: Request<HouseAndUserParams, object, RoleChangeReqBody>, res: Response) => {
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
      email: user.email,
      role,
    }
  });
};

/**
 * Remove member from household
 * @route DELETE /household/:id/members/:userId
 * @params {HouseAndUserParams} Household ID and user ID
 * @response {{ data: { memberCount: number, members: MemberDetail[] } }} Updated members list
 */
export const deleteMember = async (req: Request<HouseAndUserParams, object, object>, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);
  const { userId } = req.params;

  if(req.household.ownerId.equals(userId)) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, "Can't remove owner -- transfer ownership instead");
    return;
  }

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

/**
 * Get all pending invitations for household
 * @route GET /household/:id/invitations
 * @params {{ id: string }} Household ID
 * @response {{ data: InvitationResponse[] }} List of pending invitations
 */
export const getInvitations = async (req: Request, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  if (!req.params.id) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
    return;
  }

  const invitations = await Invitation.find({householdId: req.household.id}).exec();
  const data = invitations.map(invitation => {
     const response: InvitationResponse = {
      id: invitation._id.toString(),
      code: invitation.code,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt
    };

    return response;
  });

  res
    .apiSuccess({
      data,
    });
};

/**
 * Cancel pending household invitation
 * @route DELETE /household/:id/invitations/:invitationId
 * @params {{ id: string, invitationId: string }} Household ID and invitation ID
 * @response {{ data: InvitationResponse }} Cancelled invitation details
 */
export const cancelInvitation = async (req: Request, res: Response) => {
  assertHasUser<typeof req>(req);
  assertHasHouse<typeof req>(req);

  if (!req.params.id) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
    return;
  }

  if (!req.params.invitationId) {
    res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Invitation ID');
    return;
  }

  const invitation = await Invitation.findById(req.params.invitationId);
  
  if(!invitation) {
    res.apiError(HTTP_STATUS.NOT_FOUND, 'Missing or invalid Invitation');
    return;
  }

  const updated = await invitation.cancel();

  if(updated.status !== INVITATION_STATUS.CANCELLED) {
    res.apiError(HTTP_STATUS.CONFLICT, 'Missing or invalid Invitation');
    return;
  }

  const response: InvitationResponse = {
    id: invitation._id.toString(),
    code: invitation.code,
    email: invitation.email,
    name: invitation.name,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt
  };


  res.apiSuccess({
    data: response
  });
};

/**
 * Create and send household invitation
 * @route POST /household/:id/members/invite
 * @params {IdParam} Household ID
 * @body {InviteRequest} Invitation details (email, name?, role)
 * @response {{ data: InvitationResponse }} Created invitation details
 */
export const postInvitation = async (req: Request<IdParam, object, InviteRequest>, res: Response) => {
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

  try {
    const invitation = await Invitation.createInvitation(req.body, req.household._id.toString(), req.user.id);
    const response: InvitationResponse = {
      id: invitation._id.toString(),
      code: invitation.code,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt
    };
  
    console.log('Sending invitation to: ', name, ' ', email);
    res.apiSuccess({
      data: response
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(999);
  }
};