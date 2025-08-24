import { Alert } from '../../components/common/Alert';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Code } from '../../components/common/Code';
import { MediaCard } from '../../components/common/MediaCard';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { InviteForm } from '../../components/fragments/InviteForm';
import { Grid } from '../../components/layout/Grid';
import { useConfirmation } from '../../hooks/useConfirmation';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useHousehold } from '../../hooks/useHousehold';
import { useInvitations } from '../../hooks/useInvitations';
import { cancelInvitation, createInvitation } from '../../lib/api/invitations';
import { getExpirationInfo, formatExpirationDays } from '../../lib/utils/expirationUtils';
import type { HouseholdRoles } from '@homekeeper/shared';



export interface InvitationProps {
  email: string;
  code: string;
  role: 'admin' | 'owner' | 'member' | 'guest';
  expirationDays: number;
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  invitationId: string;
  householdId: string;
}
type Variants = 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';

export const Invitation = ({ email, code, role, rotation, expirationDays, invitationId, householdId }: InvitationProps) => {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const confirm = useConfirmation();

  const VARIANTS_BY_ROLE: Record<HouseholdRoles, Variants> = {
    owner: 'primary',
    admin: 'dark',
    member: 'secondary',
    guest: 'accent'
  };

  const cardVariant = VARIANTS_BY_ROLE[role];

  const handleCancel = async () => {
    try {
      const confirmation = await confirm({
        title: 'Remove Member',
        message: `Are you sure you want cancel the invitation to ${email}? This action cannot be undone.`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        variant: 'danger'
      });
      if(confirmation) {
        const result = await cancelInvitation(householdId, invitationId);
        console.log(result);
      }
    } catch (error) {
      console.error('Error canceling invitation', error);
    }
  };

  return (
    <MediaCard title={email} variant={cardVariant} rotation={rotation}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-white font-bold uppercase text-xs md:text-sm mt-2">
            Code: <Code size="xs">{code}</Code>
          </p>
          <p className="text-white font-bold uppercase text-xs md:text-sm mt-1">
            Role: {role} • {formatExpirationDays(expirationDays)}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <Button variant="accent" onClick={() => copyToClipboard(code)} className="min-w-[136px]">
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button variant="danger" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </MediaCard>
  );
};

export const InvitesSettings = () => {
  const { activeHouseholdId } = useHousehold();
  const { data: invitations, refetch } = useInvitations(activeHouseholdId || '');
  
  if (!activeHouseholdId) {
    return null;
  }

  const handleInviteSubmit = async (inviteData: { email: string; role: HouseholdRoles; message?: string }) => {
    await createInvitation(activeHouseholdId, inviteData);
    await refetch(); // Refresh the invitations list
  };

  return (
    <Grid columns={2} spacing="lg">
      <Card shadow="double">
        <Title variant="section">Send New Invite</Title>
        <InviteForm onSubmit={handleInviteSubmit} />
      </Card>
      <Card shadow="double">
        <Title variant="section">Pending Invitations</Title>
        <div className="space-y-8">
          {invitations?.data?.map((invite, index) => {
            const tilt = index % 2 === 0 ? 'slight-left' : 'slight-right';
            const expirationInfo = getExpirationInfo(new Date(invite.expiresAt));

            return (
              <Invitation
                key={invite.email}
                email={invite.email}
                role={invite.role}
                expirationDays={expirationInfo.daysRemaining}
                code={invite.code}
                rotation={tilt}
                householdId={activeHouseholdId}
                invitationId={invite.id}
              />
            );
          })}
          {/* <Invitation email="emma@example.com" role="member" expirationDays={4} code="XYZ789AB" rotation="slight-left"/> */}
          {/* <Invitation email="tom@example.com" role="guest" expirationDays={6} code="QRS456CD" rotation="slight-right"/> */}
        </div>
        <Alert className="mt-8 md:mt-16 p-3 md:p-4" variant="info">
          <Text className="text-white">Invitation codes expire after 7 days. Resend if needed.</Text>
        </Alert>
      </Card>
    </Grid>
  );
};