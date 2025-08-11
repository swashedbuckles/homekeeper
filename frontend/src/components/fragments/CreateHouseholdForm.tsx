import { householdSchema } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useHousehold } from '../../hooks/useHousehold.ts';
import { createHousehold } from '../../lib/api/household.ts';
import { QUERY_KEYS } from '../../lib/constants/queryKeys.ts';
import { UI as logger } from '../../lib/logger.ts';
import { ApiError } from '../../lib/types/apiError.ts';
import { Button } from '../common/Button';
import { TextArea } from '../form/TextArea.tsx';
import { TextInput } from '../form/TextInput';

import type { HouseholdDescription } from '@homekeeper/shared';

export const CreateHouseholdForm = () => {
  const queryClient = useQueryClient();
  const hContext = useHousehold();
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const formHook = useForm({ resolver: zodResolver(householdSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  const onSubmit = async (formData: HouseholdDescription) => {
    try {
      const response = await createHousehold(formData.name, formData.description);
      logger.log('Result!', response);
      if (response.data) {
        queryClient.setQueryData(QUERY_KEYS.household(response.data.id), response.data);
        hContext.switchHousehold(response.data.id);
      }

    } catch (error) {
      logger.error(error);
      if (error instanceof ApiError) {
        setServerError(error.message);
        return;
      }

      setServerError('Connection error. Please check your internet and try again.');
    }
    navigate('/onboarding/invite');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <TextInput
        type="text"
        label="Household Name (required)"
        placeholder="The Smith Family Home"
        testId="email-input"
        error={errors.name?.message}
        register={register('name')}
      />

      <TextArea
        label="Description (optional)"
        placeholder="Our family home..."
        testId="password-input"
        error={errors.description?.message}
        register={register('description')}
      />

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
        variant="primary"
        loading={isSubmitting}
        loadingText="Creating Household..."
        testId="submit-button"
        className="mt-2"
      >Create Household</Button>
    </form>
  );
};