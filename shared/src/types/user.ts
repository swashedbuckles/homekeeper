/**
 * Base type for User Model
 */
export interface IUser {
  id: string; // this is a mongoose virtual
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

