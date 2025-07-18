import { HOUSEHOLD_ROLE, type InvitationResponse } from '@homekeeper/shared';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ListItem } from '../../components/common/ListItem';
import { PageTitle } from '../../components/common/Title';
import { TextInput } from '../../components/form/TextInput';
import { SectionTitle } from '../../components/variations/SectionTitle';
import { useHousehold } from '../../hooks/useHousehold';
import { cancelInvitation, createInvitation } from '../../lib/api/invitations';

const handleCopy = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    /** @todo Show success feedback when you add toasts  */
  } catch (err) {
    /** @todo Show error feedback when you add toasts  */
    console.error('Failed to copy:', err);
  }
};

const validateEmail = (email: string): string | null => {
  const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address')
  });

  const result = emailSchema.safeParse({ email });
  return result.success ? null : result.error.errors[0]?.message || 'Invalid email';
};

export const InviteOthers = () => {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const emailRef = useRef<HTMLInputElement>(null);
  const { activeHouseholdId } = useHousehold();

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
    mutationFn: async (email: string) => {
      if (activeHouseholdId) {
        const payload = { email, role: HOUSEHOLD_ROLE.GUEST };
        const { data } = await createInvitation(activeHouseholdId, payload);
        return data ? data : Promise.reject('Missing invitation data');
      }

      return Promise.reject('No active household');
    },


    onSuccess: (data) => {
      if (emailRef.current) {
        emailRef.current.value = '';
      }

      console.log('Invitation sent successfully!');
      setInvitations(prev => [...prev, data]);

      if (emailRef.current) {
        emailRef.current.value = '';
      }
      /** @todo: Show success toast */
    },

    onError: (error) => {
      console.error('Failed to send invitation:', error);
      /** @todo: Show error toast */
    }
  });

  const handleAdd = () => {
    const email = emailRef.current?.value;
    if (!email) {
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      /** @todo show error toast */
      console.error(emailError);
      return;
    }

    inviteMutation.mutate(email);
  };

  const pendingInvitations = invitations.map(invitation => {

    return (
      <ListItem
        title={invitation.email}
        subtitle={`Code: ${invitation.code}. Expires in 14 days`}
      >
        <Button variant="outline" size="sm" onClick={() => handleCopy(invitation.code)}>Copy</Button>
        <Button variant="danger" size="sm" onClick={() => cancelInviteMutation.mutate(invitation.id)}>Delete</Button>
      </ListItem>
    );
  });

  const navigate = useNavigate();
  return (
    <div id="invite" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <PageTitle description="Generate invitation codes to share with family members.">Invite Others</PageTitle>
        </div>

        <Card variant="default" className="flex-row mb-6">
          <div className="flex space-x-2 items-end">
            <div className="flex-1">
              <TextInput ref={emailRef} label="Invite Someone" placeholder="Enter email address" type="email" grouped />
            </div>
            <Button variant="primary" className="px-4" onClick={handleAdd}>Add</Button>
          </div>
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