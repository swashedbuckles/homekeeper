import { Alert } from '../../components/common/Alert';
import { BackButton } from '../../components/common/BackButton';
import { Text } from '../../components/common/Text';
import { PageTitle } from '../../components/common/Title';
import { JoinHouseholdForm } from '../../components/fragments/JoinHouseholdForm';

export const JoinHousehold = () => {

  return (
    <div id="join" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
          <PageTitle description="Enter the invitation code you received to join an existing household.">Join a household</PageTitle>
        </div>

        <JoinHouseholdForm />

        <Alert className="mt-4" variant="info">
          <Text color="white">
            You'll join as a guest initially. The household owner can update your role later.
          </Text>
        </Alert>

      </div>
    </div>
  );
};