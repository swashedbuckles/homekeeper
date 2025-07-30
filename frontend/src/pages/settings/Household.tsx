import { householdSchema, type HouseholdDescription } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';
import { Grid } from '../../components/layout/Grid';

import { useHousehold } from '../../hooks/useHousehold';

export const HouseholdDetailsForm = () => {
  const hContext = useHousehold();
  const formHook = useForm({ resolver: zodResolver(householdSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;

  console.log('H', hContext.activeHousehold);

  const onSubmit = async (formData: HouseholdDescription) => {
    if (isSubmitting) {
      return;
    }
    console.log('onSubmit: ', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
      <Grid columns={2} spacing="lg">
        <TextInput 
          type="text" 
          label="Household Name" 
          testId="household-name-input" 
          error={errors.name?.message}
          grouped
          register={register('name')}
        />

        {/** @todo TextInput disabled should look more disabled */}
        <TextInput 
          type="text" 
          label="Created Date" 
          testId="household-created-input" 
          grouped
          disabled
          value={Date.now().toLocaleString()}
        />
      </Grid>
        
      <TextArea
        label="Description (optional)"
        placeholder="Our family home..."
        testId="password-input"
        error={errors.description?.message}
        register={register('description')}
      />
      <div>
        <Button size="lg" className="w-full sm:w-fit" variant="primary" type="submit">Save Changes</Button>
        <Button size="lg" className="ml-auto sm:ml-4 mt-4 sm:mt-auto w-full sm:w-fit" variant="tertiary">Cancel</Button>
      </div>
    </form >
  );
};

export const HouseholdSettings = () => {
  return (
    <>
      <Card shadow="double">
        <Title variant="section">Household Details</Title>
        <HouseholdDetailsForm />
      </Card>
      <Card className="mt-12" rotation="slight-left" shadow="error" variant="danger">
        <Text variant="body" size="2xl" weight="black" color="white" uppercase className="block mb-4 md:mb-6">
          Danger Zone
        </Text>
        <Card className="mt-4" shadow="none">
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
            <Button variant="danger" size="lg">
              Delete Household
            </Button>
          </div>
        </Card>
      </Card>
    </>
  );
};
