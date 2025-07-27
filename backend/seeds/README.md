# Database Seeding System

This directory contains the database seeding system for Homekeeper. It allows you to quickly populate your development database with test data.

## Overview

The seeding system is built with TypeScript and uses the existing Mongoose models. It provides:

- **BaseSeeder**: Abstract class for creating individual seeders
- **SeederRunner**: Orchestrates running multiple seeders in order
- **Individual Seeders**: Users, Households, and Invitations

## Quick Start

### Basic Seeding (preserves existing data)
```bash
npm run seed
```

### Clear database and seed fresh data
```bash
npm run seed:clear
```

### Minimal seeding (users only)
```bash
npm run seed:minimal
```

### Quiet mode (less verbose output)
```bash
npm run seed:quiet
```

## What Gets Seeded

### Users Seeder
Creates 6 test users:
- `admin@homekeeper.dev` (Admin User) - password: `admin123`
- `john@homekeeper.dev` (John Doe) - password: `password123`
- `jane@homekeeper.dev` (Jane Smith) - password: `password123`
- `bob@homekeeper.dev` (Bob Wilson) - password: `password123`
- `alice@homekeeper.dev` (Alice Johnson) - password: `password123`
- `dev@homekeeper.dev` (Dev User) - password: `dev` (simple password for development)

### Households Seeder
Creates 4 test households:
- **The Doe Family** (Owner: John, Member: Jane)
- **Alice's Apartment** (Owner: Alice)
- **Shared House** (Owner: Bob, Members: Alice, Jane)
- **Admin Test House** (Owner: Admin, Members: John, Bob)

### Invitations Seeder
Creates 4 pending invitations:
- Invitation to The Doe Family for `newcomer1@homekeeper.dev`
- Invitation to Shared House for `newcomer2@homekeeper.dev`
- Invitation to Admin Test House for `testguest@homekeeper.dev`
- Invitation to Alice's Apartment for `roommate@homekeeper.dev`

## Environment Variables

The seeder uses the same MongoDB connection as the main application:

```bash
MONGODB_URI=mongodb://localhost:27017/homekeeper
```

## Creating Custom Seeders

To create a new seeder:

1. Create a new file: `src/seeds/your-seeder.seeder.ts`
2. Extend the `BaseSeeder` class:

```typescript
import { BaseSeeder } from './index';
import { YourModel } from '../models/your-model';

export class YourSeeder extends BaseSeeder {
  constructor() {
    super('YourSeeder');
  }

  async seed(): Promise<void> {
    // Your seeding logic here
    this.log('Seeding your data...');
    
    // Example: Create data
    const item = await YourModel.create({
      name: 'Test Item'
    });
    
    this.log(`Created: ${item.name}`);
  }
}
```

3. Add it to the main seeder (`src/seeds/seed.ts`):

```typescript
import { YourSeeder } from './your-seeder.seeder';

// In the main() function:
runner.addSeeder(new YourSeeder());
```

## Safety Features

- **Duplicate Prevention**: Seeders check for existing data to avoid duplicates
- **Error Handling**: Failed seeds will stop the process and show clear error messages
- **Confirmation**: The `--clear` option shows a warning and 3-second delay
- **Logging**: Comprehensive logging shows what's being created
- **Database Connection**: Proper connection/disconnection handling

## Docker Usage

When using with Docker Compose:

```bash
# Make sure your containers are running
docker-compose up -d

# Run seeding from the backend container
docker-compose exec backend npm run seed

# Or clear and seed
docker-compose exec backend npm run seed:clear
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` environment variable
- Verify database permissions

### Duplicate Key Errors
- Use `npm run seed:clear` to start fresh
- Check if data already exists in your database

### Missing Dependencies
- Run `npm install` in the backend directory
- Ensure TypeScript and ts-node are available

## File Structure

```
src/seeds/
├── index.ts              # Base classes and utilities
├── seed.ts               # Main seeder runner
├── seed-minimal.ts       # Minimal seeder (users only)
├── users.seeder.ts       # Users seeder
├── households.seeder.ts  # Households seeder
├── invitations.seeder.ts # Invitations seeder
└── README.md            # This file
```