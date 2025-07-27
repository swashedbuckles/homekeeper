import { User } from '../src/models/user';
import { BaseSeeder } from './seeder';
import type { HouseholdRoles } from '@homekeeper/shared';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  householdRoles?: Record<string, HouseholdRoles>;
}

export class UsersSeeder extends BaseSeeder {
  constructor() {
    super('Users');
  }

  async seed(): Promise<void> {
    const users: SeedUser[] = [
      {
        email: 'admin@homekeeper.dev',
        password: 'admin123',
        name: 'Admin User',
      },
      {
        email: 'john@homekeeper.dev',
        password: 'password123',
        name: 'John Doe',
      },
      {
        email: 'jane@homekeeper.dev',
        password: 'password123',
        name: 'Jane Smith',
      },
      {
        email: 'bob@homekeeper.dev',
        password: 'password123',
        name: 'Bob Wilson',
      },
      {
        email: 'alice@homekeeper.dev',
        password: 'password123',
        name: 'Alice Johnson',
      },
      {
        email: 'dev@homekeeper.dev',
        password: 'dev',
        name: 'Dev User (Simple Password)',
      },
    ];

    for (const userData of users) {
      try {
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
          this.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }

        const user = await User.createUser({
          email: userData.email,
          password: userData.password,
          name: userData.name,
        });

        this.log(`Created user: ${user.email} (${user.name})`);
      } catch (error) {
        this.logError(`Failed to create user ${userData.email}: ${error}`);
        throw error;
      }
    }

    const userCount = await User.countDocuments();
    this.log(`Total users in database: ${userCount}`);
  }
}