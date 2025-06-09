import type { IUser as BaseUser } from '@homekeeper/shared';
import type { HydratedDocument, Model, Types } from 'mongoose';

/**
 * Base type for User Model
 */
export interface IUser extends BaseUser {
  _id: Types.ObjectId;
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
 * Hydrated Mongoose Documents for User
 */
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type SafeUserDocument = HydratedDocument<SafeUser, IUserMethods>;

/**
 * User model with static methods
 */
export interface IUserModel extends Model<IUser> {
  createUser: (userData: Pick<IUser, 'email' | 'password' | 'name'>) => Promise<UserDocument>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
}