import { InvitationStatus } from '../constants/status';
import { HouseholdRoles } from './user';

export interface RedeemInvitationRequest {
  code: string;
}

export interface RedeemResponse {
  householdId: string;
  householdName: string;
  role: HouseholdRoles;
}


export interface CreateInvitationRequest {
  email: string;
  name?: string;
  role: HouseholdRoles;
}

export interface InvitationResponse {
  id: string;
  code: string;
  email: string;
  name?: string;
  role: HouseholdRoles;
  status: InvitationStatus;
  expiresAt: Date;
}

export interface IInvitation {
  id: string;
  code: string;
  householdId: string;
  invitedBy: string;
  email: string;
  name?: string;
  role: HouseholdRoles;
  status: InvitationStatus;
  expiresAt: Date;
  // redeemedBy?: string;
  // redeemedAt?: Date;
}