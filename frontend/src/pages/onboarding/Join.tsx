import { Alert } from '../../components/common/Alert';
import { BackButton } from '../../components/common/BackButton';
import { PageTitle } from '../../components/common/Title';
import { JoinHouseholdForm } from '../../components/fragments/JoinHouseholdForm';

export const JoinHousehold = () => {

  return (
    <div id="join" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
          <PageTitle description='Enter the invitation code you received to join an existing household.'>Join a household</PageTitle>
        </div>

        <JoinHouseholdForm />

        <Alert variant='info'>
          <p className="text-blue-800 text-sm">
            You'll join as a guest initially. The household owner can update your role later.
          </p>
        </Alert>

      </div>
    </div>
  );
};