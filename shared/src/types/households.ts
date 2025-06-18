import { HouseholdRoles } from './user';

export interface SerializedHousehold {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
};

export type HouseResponse = Omit<SerializedHousehold, 'members'> & {
  memberCount: number;
  userRole: HouseholdRoles;
};