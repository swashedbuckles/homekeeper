import { HOUSEHOLD_ROLE } from '@homekeeper/shared';
import { Household } from '../src/models/household';
import { User } from '../src/models/user';
import { BaseSeeder } from './seeder';

interface SeedHousehold {
  name: string;
  description: string;
  ownerEmail: string;
  memberEmails?: string[];
}

export class HouseholdsSeeder extends BaseSeeder {
  constructor() {
    super('Households');
  }

  async seed(): Promise<void> {
    const households: SeedHousehold[] = [
      {
        name: 'The Doe Family',
        description: 'John and Jane\'s cozy home',
        ownerEmail: 'john@homekeeper.dev',
        memberEmails: ['jane@homekeeper.dev'],
      },
      {
        name: 'Alice\'s Apartment',
        description: 'A modern city apartment',
        ownerEmail: 'alice@homekeeper.dev',
      },
      {
        name: 'Shared House',
        description: 'A shared living space for friends',
        ownerEmail: 'bob@homekeeper.dev',
        memberEmails: ['alice@homekeeper.dev', 'jane@homekeeper.dev'],
      },
      {
        name: 'Admin Test House',
        description: 'Admin testing household',
        ownerEmail: 'admin@homekeeper.dev',
        memberEmails: ['john@homekeeper.dev', 'bob@homekeeper.dev'],
      },
    ];

    for (const householdData of households) {
      try {
        // Find the owner
        const owner = await User.findByEmail(householdData.ownerEmail);
        if (!owner) {
          this.log(`Owner ${householdData.ownerEmail} not found, skipping household ${householdData.name}`);
          continue;
        }

        // Check if household already exists (by name and owner)
        const existingHousehold = await Household.findOne({
          name: householdData.name,
          ownerId: owner._id
        });

        if (existingHousehold) {
          this.log(`Household ${householdData.name} already exists, skipping...`);
          continue;
        }

        // Create the household
        const household = await Household.createHousehold(
          householdData.name,
          owner._id,
          householdData.description
        );

        this.log(`Created household: ${household.name} (Owner: ${owner.name})`);

        // Add members if specified
        if (householdData.memberEmails && householdData.memberEmails.length > 0) {
          for (const memberEmail of householdData.memberEmails) {
            const member = await User.findByEmail(memberEmail);
            if (member) {
              await household.addMember(member._id, HOUSEHOLD_ROLE.MEMBER);
              this.log(`Added member ${member.name} to ${household.name}`);
            } else {
              this.log(`Member ${memberEmail} not found, skipping...`);
            }
          }
        }

      } catch (error) {
        this.logError(`Failed to create household ${householdData.name}: ${error}`);
        throw error;
      }
    }

    const householdCount = await Household.countDocuments();
    this.log(`Total households in database: ${householdCount}`);
  }
}