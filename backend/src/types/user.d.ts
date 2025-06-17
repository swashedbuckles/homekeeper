// backend/src/types/user.d.ts
import type { IUser as FrontendUser, HouseholdRoles } from '@homekeeper/shared';
import type { HydratedDocument, Model, Types } from 'mongoose';

/**
 * Backend-specific User interface 
 * This represents the actual document structure in MongoDB
 */
export interface IUserBackend extends Omit<FrontendUser, 'householdRoles' | 'id'> {
  _id: Types.ObjectId;
  householdRoles: Types.Map<HouseholdRoles>; // Mongoose Map for database efficiency
}

/**
 * Frontend-compatible SafeUser
 * This is what gets sent to the client via API responses
 */
export type SafeUser = Omit<FrontendUser, 'password'>;

/**
 * Backend SafeUser (for database operatiosn)
 */
export type SafeUserBackend = Omit<IUserBackend, 'password'>;

/**
 * Methods available on User document instances
 */
export interface IUserMethods {
  addHousehold(householdId: string, role: HouseholdRoles): Promise<void>;
  comparePassword(password: string): Promise<boolean>;
  toSafeObject(): SafeUser; // Returns frontend-compatible SafeUser
  toJSON(): SafeUser; // Returns frontend-compatible SafeUser
}

/**
 * Hydrated Mongoose Document for User
 */
export type IUserQueryHelpers = object; // placeholder until we have some
export type IUserVirtuals = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export type UserDocument = HydratedDocument<IUserBackend, IUserMethods>;


/**
 * User model interface with static methods
 */
export interface IUserModel extends Model<IUserBackend, IUserQueryHelpers, IUserMethods, IUserVirtuals> {
  createUser: (userData: Pick<IUserBackend, 'email' | 'password' | 'name'>) => Promise<UserDocument>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
}