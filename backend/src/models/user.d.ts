import { Types, HydratedDocument, Model } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  id?: string; // this is a mongoose virtual
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

export type SafeUser = Omit<IUser, 'password'>;

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  toSafeObject(): SafeUser;
  toJSON(): SafeUser;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type SafeUserDocument = HydratedDocument<SafeUser, IUserMethods>;

export interface IUserModel extends Model<IUser> {
  createUser: (userData: Pick<IUser, 'email' | 'password' | 'name'>) => Promise<UserDocument>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
}
