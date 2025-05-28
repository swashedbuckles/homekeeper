import { User } from '../models/user';
import { UserDocument } from '../models/user.d';

export async function register(userData: {
  email: string;
  password: string;
  name: string;
}) {
  const existingUser = await User.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.createUser(userData);
  return {
    user: user.toSafeObject()
  };
}

export async function login(email: string, password: string) {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    user: user.toSafeObject()
  };
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await User.findById(userId) as UserDocument | null;
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