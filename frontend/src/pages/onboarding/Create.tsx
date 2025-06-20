import { BackButton } from '../../components/common/BackButton';
import { PageTitle } from '../../components/common/Title';
import { CreateHouseholdForm } from '../../components/fragments/CreateHouseholdForm';

export const CreateHousehold = () => {

  return (
    <div id="create" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
          <PageTitle description="Give your household a name and description to get started.">Create your household</PageTitle>
        </div>

        <CreateHouseholdForm / >
      </div>
    </div>
  );
};