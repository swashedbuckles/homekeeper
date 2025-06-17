/**
 * Base User interface for frontend/API
 * This represents how the user data looks when serialized to JSON
 */
export interface IUser {
  id: string; 
  email: string;
  password: string;
  name: string;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    defaultHouseholdId?: string;
  };
  householdRoles: {
    [householdId: string]: 'owner' | 'admin' | 'member' | 'guest';
  };
}

/**
 * User without Password
 */
export type SafeUser = Omit<IUser, 'password'>;
export type HouseholdRoles = 'owner' | 'admin' | 'member' | 'guest';
