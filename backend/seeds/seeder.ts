import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({path: path.resolve(__dirname, '../../', '.env.local')});

export abstract class BaseSeeder {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract seed(): Promise<void>;

  protected log(message: string): void {
    console.log(`[SEED ${this.name}] ${message}`);
  }

  protected logError(error: unknown): void {
    console.error(`[SEED ${this.name}] Error:`, error);
  }
}

export interface SeedOptions {
  clear?: boolean;
  verbose?: boolean;
}

export class SeederRunner {
  private seeders: BaseSeeder[] = [];
  private options: SeedOptions;

  constructor(options: SeedOptions = {}) {
    this.options = { clear: false, verbose: true, ...options };
  }

  addSeeder(seeder: BaseSeeder): void {
    this.seeders.push(seeder);
  }

  async run(): Promise<void> {
    if (!mongoose.connection.readyState) {
      throw new Error('Database connection not established. Make sure to connect to MongoDB first.');
    }

    console.log('Starting database seeding...');

    if (this.options.clear) {
      console.log('Clearing existing data...');
      await this.clearDatabase();
    }

    for (const seeder of this.seeders) {
      try {
        console.log(`Running ${seeder.name} seeder...`);
        await seeder.seed();
        console.log(`${seeder.name} seeder completed`);
      } catch (error) {
        console.error(`${seeder.name} seeder failed:`, error);
        throw error;
      }
    }

    console.log('Database seeding completed successfully!');
  }

  private async clearDatabase(): Promise<void> {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }
  }
}