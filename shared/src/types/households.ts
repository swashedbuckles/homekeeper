import { HouseholdRoles } from './user';

export interface SerializedHousehold {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
};

export type AddMemberRequest = {
  userId: string;
  role: HouseholdRoles;
};

export type InviteRequest = {
  name: string;
  email: string;
  role: HouseholdRoles;
};

export type HouseResponse = Omit<SerializedHousehold, 'members'> & {
  memberCount: number;
  userRole: HouseholdRoles;
};

export type MemberDetail = {
    id: string;
    name: string;
    role: HouseholdRoles;
};

export type MemberResponse = {
  memberCount: number;
  members: MemberDetail[]
};