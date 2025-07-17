import { useNavigate } from 'react-router';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { RegistrationForm } from '../../components/fragments/RegistrationForm';
import { NarrowContainer } from '../../components/layout/containers/NarrowContainer';
import { SectionTitle } from '../../components/variations/SectionTitle';

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/dashboard');
  };

  return (
    <NarrowContainer maxWidth="md">
      <Card>
        <SectionTitle>Create Account</SectionTitle>
        <Text color="secondary" className="block mb-4" uppercase>Join Homekeeper to Organize Your Home</Text>
        <RegistrationForm onSuccess={handleSubmit} />
      </Card>
    </NarrowContainer>
  );
}