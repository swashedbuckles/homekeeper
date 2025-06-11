import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput } from "./common/TextInput";
import { loginSchema, type LoginRequest, type SafeUser } from "@homekeeper/shared";
import { useAuth } from "../hooks/useAuth";

export interface LoginFormProps {
  onSuccess?: (user: SafeUser) => void;
}

export const LoginForm = ({onSuccess}: LoginFormProps) => {
  const context = useAuth();
  const formHook = useForm({ resolver: zodResolver(loginSchema)});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  const onSubmit = async (formData: LoginRequest) => {
    try {
      const user = await context.login(formData);

      console.log('Login Result: ', user);

      if(onSuccess != null && user != null ) {
        onSuccess(user);
      }
    } catch (error) {
      console.error(error);
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
      />
      <TextInput 
        type="password"
        label="Password *"         
        placeholder="Create a secure password"
        register={register('password')}
        error={errors.password?.message}
      />
      <button type="submit" disabled={isSubmitting}   className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Logging In...' : 'Log In'}
      </button>
    </form>
  );
};