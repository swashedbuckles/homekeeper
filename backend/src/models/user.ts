import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

import { BCRYPT_SALT_ROUNDS } from '../constants';

import type { HouseholdRoles, IUser as FrontendUser} from '@homekeeper/shared';
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
  addHouseholdRole(householdId: string, role: HouseholdRoles): Promise<void>;
  removeHouseholdRole(householdId: string): Promise<void>;

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

const userSchema = new Schema<IUserBackend, IUserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => isEmail(value),
        message: (props): string => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    preferences: {
      theme: String,
      notifications: {
        email: Boolean,
        push: Boolean,
      },
      defaultHouseholdId: Schema.Types.ObjectId,
    },
    householdRoles: {
      type: Map,
      of: String, // "owner" | "admin" | "member" | "guest"
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    methods: {
      async addHouseholdRole(this: UserDocument, householdId: string, role: HouseholdRoles): Promise<void> {
        this.householdRoles.set(householdId, role);
        await this.save();
      },

      async removeHouseholdRole(this: UserDocument, householdId: string): Promise<void> {
        if(this.householdRoles.has(householdId)) {
          this.householdRoles.delete(householdId);
        }

        await this.save();
      },

      async comparePassword(this: UserDocument, pword: string): Promise<boolean> {
        return bcrypt.compare(pword, this.password);
      },

      toSafeObject(this: UserDocument): SafeUser {
        const obj = this.toObject();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, _id, ...rest } = obj;
        const householdRoles: Record<string, HouseholdRoles> = {};
         
        if (this.householdRoles.size > 0) {
          for(const [household, role] of this.householdRoles.entries()) {
            householdRoles[household] = role;
          }
        }

        return {
          ...rest,
          id: this.id as string, // Mongoose virtual Id typed as `any` for bwd compat but it's a strin.
          householdRoles,        // see: https://github.com/Automattic/mongoose/issues/13079 
        } as SafeUser;
      },

      toJSON(this: UserDocument): SafeUser {
        return this.toSafeObject();
      },
    },

    statics: {
      async createUser(userData: {
        email: string;
        password: string;
        name: string;
      }): Promise<UserDocument> {
        const user = new this({
          householdRoles: {},
          ...userData
        });
        return user.save() as Promise<UserDocument>; // workaround for struggling with mongoose typing.
      },

      async findByEmail(email: string): Promise<UserDocument | null> {
        return this.findOne({ email }).exec() as Promise<UserDocument>;
      },
    },
  },
);

/**
 * Pre-save hook to hash the password before storing it in the database.
 * Should only hash if the password has been modified (which even counts for
 * new users).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); 
    return;
  }

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = model<IUserBackend, IUserModel>('User', userSchema);