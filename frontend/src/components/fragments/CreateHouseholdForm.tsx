import { useNavigate } from 'react-router';
import { Button } from '../common/Button';
import { TextArea } from '../form/TextArea.tsx';
import { TextInput } from '../form/TextInput';

export const CreateHouseholdForm = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/onboarding/invite');
  };
  
  return (
    <form onSubmit={handleSubmit}>

      <TextInput 
        type="text"
        label="Household Name *"    
        placeholder="The Smith Family Home"
        testId="email-input"
      />

      <TextArea 
        label="Description (optinal)"         
        placeholder="Our family home..."
        testId="password-input"
      />

      <Button 
        full
        type="submit" 
        variant="primary" 
        loadingText="Logging In..."
        testId="submit-button"
      >Create Household</Button>
    </form>
  );
};