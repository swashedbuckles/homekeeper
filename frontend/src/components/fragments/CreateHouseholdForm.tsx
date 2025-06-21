import { householdSchema } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { apiRequest } from '../../lib/apiClient';
import { UI as logger } from '../../lib/logger.ts';
import { ApiError } from '../../lib/types/apiError.ts';
import { Button } from '../common/Button';
import { TextArea } from '../form/TextArea.tsx';
import { TextInput } from '../form/TextInput';

import type { HouseholdDescription, SerializedHousehold } from '@homekeeper/shared';

export const CreateHouseholdForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const formHook = useForm({ resolver: zodResolver(householdSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  const onSubmit = async (formData: HouseholdDescription) => {
    try {
      const response = await apiRequest<SerializedHousehold>('/households', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      logger.log('Result!', response);

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
        label="Household Name *"
        placeholder="The Smith Family Home"
        testId="email-input"
        error={errors.name?.message}
        register={register('name')}
      />

      <TextArea
        label="Description (optinal)"
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
      >Create Household</Button>
    </form>
  );
};