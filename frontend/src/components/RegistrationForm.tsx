import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput } from "./common/TextInput";
import { frontendRegisterSchema } from "../lib/schema/Registration";
import { register as registerUser } from "../lib/api/auth";
import type { RegisterRequest, SafeUser } from "@homekeeper/shared";

export interface RegistrationFormProps {
  onSuccess?: (user: SafeUser) => void; // Optional callback for pages
}

export const RegistrationForm = ({onSuccess}: RegistrationFormProps) => {
    const formHook = useForm({ resolver: zodResolver(frontendRegisterSchema)});
    const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

    const onSubmit = async (formData: RegisterRequest) => {
      try {
        const {data: user, message} = await registerUser(formData.email, formData.password, formData.name);
        console.log('Registration Result: ', message);

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
        type="text"
        label="Full Name *"        
        placeholder="Enter your full name"
        register={register('name')}
        error={errors.name?.message}
      />
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
      <TextInput 
        type="password"
        label="Password (confirm)*"
        placeholder="Confirm your password"
        register={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <button type="submit" disabled={isSubmitting}   className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};