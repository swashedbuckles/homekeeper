import { loginSchema, type LoginRequest, type SafeUser } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../hooks/useAuth';
import { UI as logger } from '../../lib/logger';
import { ApiError } from '../../lib/types/apiError';
import { Button } from '../common/Button';
import { TextInput } from '../form/TextInput';

export interface LoginFormProps {
  onSuccess?: (user: SafeUser) => void;
}

export const LoginForm = ({onSuccess}: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const context = useAuth();
  const formHook = useForm({ resolver: zodResolver(loginSchema)});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  const onSubmit = async (formData: LoginRequest) => {
    try {
      const user = await context.login(formData);

      logger.log('Login Result: ', user);

      if(onSuccess != null && user != null ) {
        onSuccess(user);
      }
    } catch (error) {
      logger.error(error);
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setServerError('Invalid email or password.');
        } else if (error.statusCode === 429) {
          setServerError('Too many login attempts. Please try again later.');
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
        error={errors.password?.message}
        testId="password-input"
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
        loadingText="Logging In..."
        testId="submit-button"
      >Log In</Button>
    </form>
  );
};