import { type HouseholdRoles, HOUSEHOLD_ROLE } from '@homekeeper/shared';
import { Household } from '../src/models/household';
import { Invitation } from '../src/models/invitation';
import { User } from '../src/models/user';
import { BaseSeeder } from './seeder';

interface SeedInvitation {
  householdName: string;
  ownerEmail: string;
  inviteeEmail: string;
  inviteeName?: string;
  role: HouseholdRoles;
}

export class InvitationsSeeder extends BaseSeeder {
  constructor() {
    super('Invitations');
  }

  async seed(): Promise<void> {
    const invitations: SeedInvitation[] = [
      {
        householdName: 'The Doe Family',
        ownerEmail: 'john@homekeeper.dev',
        inviteeEmail: 'newcomer1@homekeeper.dev',
        inviteeName: 'New Member 1',
        role: HOUSEHOLD_ROLE.MEMBER,
      },
      {
        householdName: 'Shared House',
        ownerEmail: 'bob@homekeeper.dev',
        inviteeEmail: 'newcomer2@homekeeper.dev',
        inviteeName: 'New Member 2',
        role: HOUSEHOLD_ROLE.MEMBER,
      },
      {
        householdName: 'Admin Test House',
        ownerEmail: 'admin@homekeeper.dev',
        inviteeEmail: 'testguest@homekeeper.dev',
        inviteeName: 'Test Guest',
        role: HOUSEHOLD_ROLE.GUEST,
      },
      {
        householdName: 'Alice\'s Apartment',
        ownerEmail: 'alice@homekeeper.dev',
        inviteeEmail: 'roommate@homekeeper.dev',
        inviteeName: 'Future Roommate',
        role: HOUSEHOLD_ROLE.ADMIN,
      },
    ];

    for (const invitationData of invitations) {
      try {
        // Find the owner
        const owner = await User.findByEmail(invitationData.ownerEmail);
        if (!owner) {
          this.log(`Owner ${invitationData.ownerEmail} not found, skipping invitation`);
          continue;
        }

        // Find the household
        const household = await Household.findOne({
          name: invitationData.householdName,
          ownerId: owner._id
        });

        if (!household) {
          this.log(`Household ${invitationData.householdName} not found, skipping invitation`);
          continue;
        }

        // Check if invitation already exists
        const existingInvitation = await Invitation.findOne({
          email: invitationData.inviteeEmail,
          householdId: household._id
        });

        if (existingInvitation) {
          this.log(`Invitation for ${invitationData.inviteeEmail} to ${invitationData.householdName} already exists, skipping...`);
          continue;
        }

        // Create the invitation
        const invitation = await Invitation.createInvitation(
          {
            email: invitationData.inviteeEmail,
            name: invitationData.inviteeName,
            role: invitationData.role,
          },
          household._id,
          owner._id
        );

        this.log(`Created invitation: ${invitationData.inviteeEmail} -> ${invitationData.householdName} (${invitationData.role}) [Code: ${invitation.code}]`);

      } catch (error) {
        this.logError(`Failed to create invitation for ${invitationData.inviteeEmail}: ${error}`);
        throw error;
      }
    }

    const invitationCount = await Invitation.countDocuments();
    this.log(`Total invitations in database: ${invitationCount}`);
  }
}