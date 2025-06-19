import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

import { BCRYPT_SALT_ROUNDS } from '../constants';

import type { IUserBackend, IUserMethods, IUserModel, UserDocument } from '../types/user';
import type { HouseholdRoles, SafeUser } from '@homekeeper/shared';

export type * from '../types/user.d'; // so we don't have to go searching for the type file

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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.householdRoles && this.householdRoles.size > 0) {
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
        return this.findOne({ email }).exec() as Promise<UserDocument | null>;
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