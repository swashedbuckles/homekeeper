import { HOUSEHOLD_ROLE, type HouseholdRoles } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../common/Button';
import { Select, Option } from '../form/Select';
import { TextArea } from '../form/TextArea';
import { TextInput } from '../form/TextInput';

const inviteFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.nativeEnum(HOUSEHOLD_ROLE),
  message: z.string().optional()
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

export interface InviteFormProps {
  /** Function called when form is submitted with valid data */
  onSubmit: (data: { email: string; role: HouseholdRoles; message?: string }) => Promise<void>;
  /** Whether form is in loading state */
  isLoading?: boolean;
}

/**
 * Responsive form component for sending household invitations.
 * 
 * Provides a standardized invitation form with email input, role selection,
 * and optional personal message. Automatically adapts to container size.
 * 
 * @example
 * ```tsx
 * <InviteForm 
 *   onSubmit={async (data) => {
 *     await createInvitation(householdId, data);
 *   }}
 *   isLoading={isSubmitting}
 * />
 * ```
 */
export const InviteForm = ({
  onSubmit,
  isLoading = false
}: InviteFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      role: HOUSEHOLD_ROLE.GUEST,
      message: ''
    }
  });

  const onFormSubmit = async (data: InviteFormData) => {
    try {
      const submitData = {
        email: data.email.trim(),
        role: data.role,
        ...(data.message?.trim() && { message: data.message.trim() })
      };

      await onSubmit(submitData);
      
      // Reset form on success
      reset();
    } catch (error) {
      console.error('Failed to submit invitation:', error);
      // Note: Error handling should be done by the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 md:space-y-6">
      <TextInput
        type="email"
        label="Email Address *"
        placeholder="Enter Email Address"
        register={register('email')}
        error={errors.email?.message}
        disabled={isLoading || isSubmitting}
      />

      <Select 
        label="Initial Role *"
        register={register('role')}
        error={errors.role?.message}
        disabled={isLoading || isSubmitting}
      >
        <Option value={HOUSEHOLD_ROLE.GUEST}>Guest - View Only</Option>
        <Option value={HOUSEHOLD_ROLE.MEMBER}>Member - Can Edit</Option>
        <Option value={HOUSEHOLD_ROLE.ADMIN}>Admin - Full Access</Option>
      </Select>

      <TextArea
        label="Personal Message (Optional)"
        placeholder="Hey! Join our household to help manage our home..."
        register={register('message')}
        disabled={isLoading || isSubmitting}
      />

      <Button
        type="submit"
        full
        variant="primary"
        disabled={isLoading || isSubmitting}
        loading={isLoading || isSubmitting}
        loadingText="Sending..."
      >
        Send Invitation
      </Button>
    </form>
  );
};