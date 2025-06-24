import { Check, Plus, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../components/common/Button';
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
          <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome to The {hContext.activeHousehold?.name} Home!</h1>
          <p className="text-text-secondary">You're all set up and ready to start organizing your household maintenance.</p>
        </div>

        <div className="bg-white rounded-xl border border-ui-border p-6 mb-6">
          <h3 className="font-semibold text-text-primary mb-4">What's next?</h3>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start">
              <FileText className="mr-2"/>
              <span>Upload and organize your manuals</span>
            </li>
            <li className="flex items-start">
              <Plus className="mr-2"/>
              <span>Add your household assets and equipment</span>
            </li>
            <li className="flex items-start">
              <Clock className="mr-2"/>
              <span>Set up maintenance schedules and reminders</span>
            </li>
          </ul>
        </div>

        <Button full variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
};