export const HOUSEHOLD_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
} as const;

export type HouseholdRoles = typeof HOUSEHOLD_ROLE [keyof typeof HOUSEHOLD_ROLE];

export const HOUSEHOLD_ROLES = [
  'owner', 
  'admin', 
  'member', 
  'guest'
]  as const;