import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { ActionItem } from '../../components/common/ActionItem';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageTitle } from '../../components/common/Title';
import { TextInput } from '../../components/form/TextInput';
import { SectionTitle } from '../../components/variations/SectionTitle';
import { apiRequest } from '../../lib/apiClient';

import type { InvitationResponse } from '@homekeeper/shared';

export const InviteOthers = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const email = emailRef.current?.value;
    if (!email) {
      return;
    }

    apiRequest<InvitationResponse>('/household/:id/members/invite', {
      method: 'POST',
      body: JSON.stringify({email, role: 'guest'})
    });


    if (emailRef.current) {
      emailRef.current.value = '';
    }
  };

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
              <ActionItem
                title="ABC123XY"
                subtitle="Expires in 6 days"
                actions={
                  <div className="flex space-x-3">
                    <button className="text-primary hover:text-text-primary text-sm font-medium">Copy</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </div>
                }
              />

              <ActionItem
                title="DEF456UV"
                subtitle="Expires in 3 days"
                actions={
                  <div className="flex space-x-3">
                    <button className="text-primary hover:text-text-primary text-sm font-medium">Copy</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </div>
                }
              />
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