import { invitationCodeSchema } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { apiRequest } from '../../lib/apiClient';
import { UI as logger } from '../../lib/logger.ts';
import { ApiError } from '../../lib/types/apiError';
import { Button } from '../common/Button';
import { CodeInput } from '../variations/CodeInput';

import type { RedeemInvitationRequest, RedeemResponse } from '@homekeeper/shared';

export const JoinHouseholdForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const formHook = useForm({ resolver: zodResolver(invitationCodeSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  const onSubmit = async (formData: RedeemInvitationRequest) => {
    try {
      const response = await apiRequest<RedeemResponse>('/invitations/redeem', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      console.log('RESPONSE', response);
      navigate('/onboarding/success');
    } catch (error) {
      logger.error(error);
      if (error instanceof ApiError) {
        setServerError(error.message);
        return;
      }

      setServerError('Connection error. Please check your internet and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CodeInput
        label="Invitation Code *"
        placeholder="ABC123XY"
        testId="code-input"
        error={errors.code?.message}
        register={register('code')}
      />

      <p className="text-text-secondary text-sm mt-2 mb-4">Enter the 6-8 character code exactly as shown</p>


      {serverError && (
        <div
          data-testid="error-message"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
        >
          {serverError}
        </div>
      )}
      
      <Button
        full
        type="submit"
        variant="secondary"
        loadingText="Checking Code..."
        loading={isSubmitting}
        testId="submit-button"
      >Join Household</Button>
    </form>
  );
};