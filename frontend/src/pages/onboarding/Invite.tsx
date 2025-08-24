import { type InvitationResponse, type HouseholdRoles } from '@homekeeper/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SimpleListItem } from '../../components/common/SimpleListItem';
import { Title } from '../../components/common/Title';
import { InviteForm } from '../../components/fragments/InviteForm';
import { SectionTitle } from '../../components/variations/SectionTitle';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useHousehold } from '../../hooks/useHousehold';
import { cancelInvitation, createInvitation } from '../../lib/api/invitations';
import { formatExpirationDays } from '../../lib/utils/expirationUtils';


export const InviteOthers = () => {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const { activeHouseholdId } = useHousehold();
  const { copyToClipboard, copied } = useCopyToClipboard();

  const cancelInviteMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (activeHouseholdId) {
        const { data } = await cancelInvitation(activeHouseholdId, invitationId);
        return data ? data : Promise.reject('Missing invitation data');
      }

      return Promise.reject('No active household');
    }, 

    onSuccess: (data) => {
      if(data.id) {
        setInvitations(invitations.filter(invite => invite.id !== data.id));
      }
    },

    onError: (error) => {
      console.error('Failed to cancel invitation', error);
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async (inviteData: { email: string; role: HouseholdRoles; message?: string }) => {
      if (activeHouseholdId) {
        const { data } = await createInvitation(activeHouseholdId, inviteData);
        return data ? data : Promise.reject('Missing invitation data');
      }

      return Promise.reject('No active household');
    },

    onSuccess: (data) => {
      console.log('Invitation sent successfully!');
      setInvitations(prev => [...prev, data]);
      /** @todo: Show success toast */
    },

    onError: (error) => {
      console.error('Failed to send invitation:', error);
      /** @todo: Show error toast */
    }
  });

  const handleInviteSubmit = async (data: { email: string; role: HouseholdRoles; message?: string }) => {
    await inviteMutation.mutateAsync(data);
  };

  const pendingInvitations = invitations.map(invitation => {
    return (
      <SimpleListItem
        key={invitation.id}
        title={invitation.email}
        subtitle={`Code: ${invitation.code}. ${formatExpirationDays(14)}`}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="min-w-[80px]"
          onClick={() => copyToClipboard(invitation.code)}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button variant="danger" size="sm" onClick={() => cancelInviteMutation.mutate(invitation.id)}>Delete</Button>
      </SimpleListItem>
    );
  });

  const navigate = useNavigate();
  return (
    <div id="invite" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <Title description="Generate invitation codes to share with family members.">Invite Others</Title>
        </div>

        <Card variant="default" className="mb-6">
          <InviteForm 
            onSubmit={handleInviteSubmit}
            isLoading={inviteMutation.isPending}
          />
        </Card>

        <div className="space-y-4 mb-6">
          <Card>
            <SectionTitle>Pending invitations</SectionTitle>

            <div className="space-y-3">
              {pendingInvitations}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Button full variant="secondary" onClick={() => navigate('/onboarding/success')}>Continue</Button>
          <Button full variant="outline" onClick={() => navigate('/dashboard')}>Skip for now</Button>
        </div>
      </div>
    </div>
  );
};