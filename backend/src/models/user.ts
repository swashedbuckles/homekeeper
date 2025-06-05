import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

import { BCRYPT_SALT_ROUNDS } from '../constants';
import type { IUser, IUserModel, IUserMethods, SafeUser, UserDocument } from '../types/user';
export type * from '../types/user.d'; // so we don't have to go searching for the type file

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value): boolean => isEmail(value),
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
      async comparePassword(pword): Promise<boolean> {
        return bcrypt.compare(pword, this.password);
      },

      toSafeObject(): SafeUser {
        const me = this.toObject();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = me;
        return safeUser as SafeUser;
      },

      toJSON(): SafeUser {
        return this.toSafeObject();
      },
    },

    statics: {
      createUser(userData: { email: string; password: string; name: string }): Promise<UserDocument> {
        const user = new this(userData);
        return user.save() as Promise<UserDocument>; // workaround for struggling with mongoose typing.
      },

      findByEmail(email: string): Promise<UserDocument | null> {
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
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = model<IUser, IUserModel>('User', userSchema);
