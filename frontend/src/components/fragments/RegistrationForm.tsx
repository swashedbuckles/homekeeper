import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { register as registerUser } from '../lib/api/auth';
import { UI as logger } from '../lib/logger';
import { frontendRegisterSchema } from '../lib/schema/Registration';
import { ApiError } from '../lib/types/apiError';

import { Button } from './common/Button';
import { PasswordStrengthIndicator } from './form/PasswordStrengthIndicator';
import { TextInput } from './form/TextInput';

import type { RegisterRequest, SafeUser } from '@homekeeper/shared';

export interface RegistrationFormProps {
  onSuccess?: (user: SafeUser) => void; 
}

export const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const formHook = useForm({ resolver: zodResolver(frontendRegisterSchema) });
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = formHook;
  
  const password = watch('password');
  const onSubmit = async (formData: RegisterRequest) => {
    try {
      const { data: user, message } = await registerUser(formData.email, formData.password, formData.name);
      logger.log('Registration Result: ', message);

      if (onSuccess != null && user != null) {
        onSuccess(user);
      }

    } catch (error: unknown) {
      logger.error(error);
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          setServerError('An account with this email already exists.');
        } else if (error.statusCode === 400) {
          setServerError('Please check your information and try again.');
        } else if (error.statusCode >= 500) {
          setServerError('Server error. Please try again in a moment.');
        } else {
          setServerError('Something went wrong. Please try again.');
        }
      } else {
          setServerError('Connection error. Please check your internet and try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        type="text"
        label="Full Name *"
        placeholder="Enter your full name"
        register={register('name')}
        error={errors.name?.message}
        testId="name-input"
      />
    
      <TextInput
        type="email"
        label="Email Address *"
        placeholder="your.email@example.com"
        register={register('email')}
        error={errors.email?.message}
        testId="email-input"      
      />

      <TextInput
        type="password"
        label="Password *"
        placeholder="Create a secure password"
        register={register('password')}
        validationFeedback={password ? <PasswordStrengthIndicator password={password} /> : null}
        error={errors.password?.message}
        testId="password-input"
      />

      <TextInput
        type="password"
        label="Password (confirm)*"
        placeholder="Confirm your password"
        register={register('confirmPassword')}
        error={errors.confirmPassword?.message}
        testId="confirm-password-input"
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
        disabled={isSubmitting} 
        variant="primary" 
        loading={isSubmitting} 
        loadingText="Creating Account..."
        testId="submit-button"
      >Create Account</Button>
    </form>
  );
};