import { Button } from '../common/Button';
import { CodeInput } from '../variations/CodeInput';

export const JoinHouseholdForm = () => {
  const handleSubmit = () => {

  };
  return (
    <form onSubmit={handleSubmit}>
      <CodeInput
        label="Invitation Code *"    
        placeholder="ABC123XY"
        testId="invitaiton-input"
      />

      <p className="text-text-secondary text-sm mt-2 mb-4">Enter the 6-8 character code exactly as shown</p>

      <Button 
        full
        type="submit" 
        variant="secondary" 
        loadingText="Logging In..."
        testId="submit-button"
      >Join Household</Button>
    </form>
  );
};