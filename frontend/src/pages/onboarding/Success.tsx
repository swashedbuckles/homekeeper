import { Check, Plus, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../components/common/Button';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { useHousehold } from '../../hooks/useHousehold';

export const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const hContext = useHousehold();
  
  return (
    <div id="success" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-800" size="48" />
          </div>
          <Title variant="subsection" className="mb-2">Welcome to The {hContext.activeHousehold?.name} Home!</Title>
          <Text variant="body" size="medium" weight="normal" color="secondary">
            You're all set up and ready to start organizing your household maintenance.
          </Text>
        </div>

        <div className="bg-white rounded-xl border border-ui-border p-6 mb-6">
          <Text variant="body" size="medium" weight="bold" color="dark" className="block mb-4">
            What's next?
          </Text>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start">
              <FileText className="mr-2"/>
              <Text variant="body" size="medium" weight="normal" color="secondary">
                Upload and organize your manuals
              </Text>
            </li>
            <li className="flex items-start">
              <Plus className="mr-2"/>
              <Text variant="body" size="medium" weight="normal" color="secondary">
                Add your household assets and equipment
              </Text>
            </li>
            <li className="flex items-start">
              <Clock className="mr-2"/>
              <Text variant="body" size="medium" weight="normal" color="secondary">
                Set up maintenance schedules and reminders
              </Text>
            </li>
          </ul>
        </div>

        <Button full variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
};