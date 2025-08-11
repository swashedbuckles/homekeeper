export const ENTITIES = {
  households: 'households',
  profile: 'profiles',
} as const;

export const RELATIONS = {
  members: 'members',
  invitations: 'invitations',
} as const;

export const QUERY_KEYS = {
  households: () => [ENTITIES.households] as const,
  household: (id: string) => [ENTITIES.households, id] as const,

  members: (householdId: string) => [ENTITIES.households, householdId, RELATIONS.members] as const,
  member: (householdId: string, memberId: string) => [ENTITIES.households, householdId, RELATIONS.members, memberId] as const,

  invitations: (householdId: string) => [ENTITIES.households, householdId, RELATIONS.invitations] as const,

  profile: () => [ENTITIES.profile] as const
} as const;