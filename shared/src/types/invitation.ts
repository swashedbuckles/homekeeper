import { InvitationStatus } from '../constants/status';
import { HouseholdRoles } from './user';

export interface RedeemInvitationRequest {
  code: string;
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

export interface RedeemResponse {
  householdId: string;
  householdName: string;
  role: string;
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