import type { HydratedDocument, Model, Types } from 'mongoose';

/**
 * Base type for User Model
 */
export interface IUser {
  _id: Types.ObjectId;
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

/**
 * Methods on User instance
 */
export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  toSafeObject(): SafeUser;
  toJSON(): SafeUser;
}

/**
 * Hydrated Mongoose Document for User
 */
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
/**
 * Safe version of the hydrated document
 */
export type SafeUserDocument = HydratedDocument<SafeUser, IUserMethods>;

/**
 * User model with static methods
 */
export interface IUserModel extends Model<IUser> {
  createUser: (userData: Pick<IUser, 'email' | 'password' | 'name'>) => Promise<UserDocument>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
}
