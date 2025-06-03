import { User } from '../models/user';
import { SafeUser, UserDocument } from '../types/user';

type AuthenticationData = { user: SafeUser };
type registrationParams = Pick<UserDocument, 'email' | 'password' | 'name'>;

export async function register(userData: registrationParams): Promise<AuthenticationData> {
  const existingUser = await User.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.createUser(userData);
  return { user: user.toSafeObject() };
}

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
