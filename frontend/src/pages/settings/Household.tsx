import { householdSchema, type HouseholdDescription } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';

import { useHousehold } from '../../hooks/useHousehold';

export const HouseholdDetailsForm = () => {
  const hContext = useHousehold();
  const formHook = useForm({resolver: zodResolver(householdSchema)});
  const { register, handleSubmit, formState: { errors, isSubmitting }} = formHook;
  
  console.log('H', hContext.activeHousehold);
  
  const onSubmit = async (formData: HouseholdDescription) => {
    if(isSubmitting) {
      return;
    }
    console.log('onSubmit: ', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text size="lg" weight="black" className="block">Household Details</Text>
      <div className="flex">
        <TextInput 
          type="text" 
          label="Household Name" 
          testId="household-name-input" 
          error={errors.name?.message}
          grouped
          register={register('name')}
        />

        <TextInput 
          type="text" 
          label="Created Date" 
          testId="household-created-input" 
          grouped
          disabled
          value={Date.now().toLocaleString()}
        />

        <TextArea
          label="Description (optional)"
          placeholder="Our family home..."
          testId="password-input"
          error={errors.description?.message}
          register={register('description')}
        />
      </div>
      <div>
        <Button size="lg" variant="primary" type="submit">Save Changes</Button>
        <Button size="lg" variant="tertiary">Cancel</Button>
      </div>
    </form>
  );
};

export const HouseholdSettings = () => {
  return (
    <>
      <Card shadow="double">
        <HouseholdDetailsForm />
      </Card>
      <Card className="mt-12" rotation="slight-left" shadow="error" variant="danger">
        <Text variant="body" size="2xl" weight="black" color="white" uppercase className="block mb-4 md:mb-6">
          Danger Zone
        </Text>
        <Card className="mt-4 ml-10 mr-10" shadow="none">
          <Text variant="body" size="lg" weight="black" color="dark" uppercase className="block mb-3 md:mb-4">
            Delete Household
          </Text>
          <Text
            variant="body"
            size="sm"
            weight="bold"
            color="secondary"
            uppercase
            className="block mb-4 md:mb-6 leading-relaxed"
          >
            This will permanently delete your household, all manuals, schedules, and member access. This action cannot
            be undone.
          </Text>
          <div className="mt-4">
            <Button variant="danger" size="xl">
              Delete Household
            </Button>
          </div>
        </Card>
      </Card>
    </>
  );
};
