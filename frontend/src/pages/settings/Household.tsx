import { HOUSEHOLD_ROLE, householdSchema, type ApiResponse, type HouseholdDescription, type HouseResponse } from '@homekeeper/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';
import { Grid } from '../../components/layout/Grid';

import { useHousehold } from '../../hooks/useHousehold';
import { deleteHousehold, updateHousehold } from '../../lib/api/household';
import { QUERY_KEYS } from '../../lib/constants/queryKeys.ts';
import { UI as logger } from '../../lib/logger.ts';
import { ApiError } from '../../lib/types/apiError.ts';

export const HouseholdDetailsForm = () => {
  const queryClient = useQueryClient();
  const hContext = useHousehold();
  const formHook = useForm({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: hContext.activeHousehold?.name ?? 'Unknown',
      description: hContext.activeHousehold?.description ?? ''
    }
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formHook;
  
  useEffect(() => {
    if (hContext.activeHousehold) {
      formHook.reset({
        name: hContext.activeHousehold.name ?? '',
        description: hContext.activeHousehold.description ?? ''
      });
    }
  }, [hContext.activeHousehold, formHook]);

  const onSubmit = async (formData: HouseholdDescription) => {
    if (isSubmitting || !hContext.activeHouseholdId) {
      return;
    }
    try {
      const response = await updateHousehold(hContext.activeHouseholdId, formData.name, formData.description);
      if (response.data) {
        queryClient.setQueryData(QUERY_KEYS.household(response.data.id), response);
        queryClient.setQueryData(QUERY_KEYS.households(), (oldHouseholds: ApiResponse<HouseResponse[]> | undefined) => {
          if (!oldHouseholds?.data) {
            return oldHouseholds;
          }
          
          return oldHouseholds.data.map(household => household.id === response.data?.id ? response : household);
        });
      }
    } catch (error) {
      logger.error(error);
      if (error instanceof ApiError) {
        // do somethign
      }
    }
  };

  const onCancel = () => {
    formHook.reset();
  };

  const createdDate = hContext.activeHousehold?.createdAt
    ? new Date(hContext.activeHousehold?.createdAt).toLocaleDateString()
    : 'Not Available';

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

        <TextInput
          type="text"
          label="Created Date"
          testId="household-created-input"
          grouped
          disabled
          value={createdDate}
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
        <Button size="lg" className="w-full sm:w-fit" variant="primary" type="submit" loading={isSubmitting} loadingText="Saving...">Save Changes</Button>
        <Button size="lg" className="ml-auto sm:ml-4 mt-4 sm:mt-auto w-full sm:w-fit" variant="tertiary" onClick={onCancel}>Cancel</Button>
      </div>
    </form >
  );
};

export const DeleteHousehold = ({householdId}: {householdId: string}) => {
  return (
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
          <Button variant="danger" size="lg" onClick={() => deleteHousehold(householdId)}>
            Delete Household
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export const HouseholdSettings = () => {
  const { currentRole, activeHouseholdId } = useHousehold();
  const isOwner = currentRole === HOUSEHOLD_ROLE.OWNER;

  return (
    <>
      <Card shadow="double">
        <Title variant="section">Household Details</Title>
        <HouseholdDetailsForm />
      </Card>

      {isOwner && activeHouseholdId ? <DeleteHousehold householdId={activeHouseholdId} /> : null}
    </>
  );
};
