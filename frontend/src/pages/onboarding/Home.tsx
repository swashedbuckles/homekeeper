import { Plus, KeyRound } from 'lucide-react';

import { useNavigate, Link } from 'react-router';
import { PageTitle } from '../../components/common/Title';
import { OptionCard } from '../../components/variations/OptionCard';

export const OnboardingHome = () => {
  const navigate = useNavigate();

  const getStartedClicked = () => navigate('/onboarding/create');
  const joinClicked = () => navigate('/onboarding/join');

  return (
    <div id="decision" className="screen active">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <PageTitle description="Let's get your household organized. How would you like to start?">Welcome to HomeKeeper!</PageTitle>
        </div>

        <div className="space-y-4 mb-8">
          <OptionCard
            title="Create a new household"
            description="Start fresh and invite family members to join you in organizing your home maintenance."
            buttonText="Get Started"
            variant="primary"
            onClick={getStartedClicked}
            icon={<Plus className="text-primary"/>}
          />

          <OptionCard 
            title="Join existing household"
            description="Have an invitation code? Join a household that's already been set up."
            buttonText="Join with Code"
            variant="secondary"
            onClick={joinClicked}
            icon={<KeyRound className="text-secondary"/>}
          />
        </div>
        <div className="text-center">
          <Link to="/dashboard" className="text-text-secondary text-sm hover:text-text-primary transition-colors">I'll do this later</Link>
        </div>
      </div>
    </div>

  );
};