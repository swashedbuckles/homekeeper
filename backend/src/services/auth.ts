import { ERROR_MESSAGES } from '../constants';
import { User } from '../models/user';

import type { SafeUser, UserDocument } from '../models/user';

/** Return from authentication helpers; may expand to include JWT info */
export type AuthenticationData = { user: SafeUser };
/** Required values for authentication */
export type RegistrationParams = Pick<UserDocument, 'email' | 'password' | 'name'>;

/**
 * Register a new user in the system
 *
 * @param userData Email/Name/Password
 * @returns Authenticated User
 */
export async function register(userData: RegistrationParams): Promise<AuthenticationData> {
  const existingUser = await User.findByEmail(userData.email);
  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  const user = await User.createUser(userData);
  return { user: user.toSafeObject() };
}

/**
 * Allow an existing user to log in
 *
 * @param email email-address
 * @param password user password
 * @returns Authenticated User
 */
export async function login(email: string, password: string): Promise<AuthenticationData> {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  return { user: user.toSafeObject() };
}

/**
 * Change a user's password
 *
 * @param userId id of user model to change
 * @param oldPassword old password
 * @param newPassword new password
 * @returns Authenticated User
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
): Promise<SafeUser> {
  /** @todo figure out how to assert this properly.  */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const user = (await User.findById(userId)) as UserDocument | null;
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD);
  }

  user.password = newPassword;
  await user.save();
  return user.toSafeObject();
}
