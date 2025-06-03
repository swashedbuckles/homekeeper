import { User } from '../models/user';
import { SafeUser, UserDocument } from '../types/user';

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
    throw new Error('User already exists');
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
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
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
export async function changePassword(userId: string, oldPassword: string, newPassword: string): Promise<SafeUser> {
  const user = (await User.findById(userId)) as UserDocument | null;
  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error('Invalid current password');
  }

  user.password = newPassword;
  await user.save();
  return user.toSafeObject();
}
