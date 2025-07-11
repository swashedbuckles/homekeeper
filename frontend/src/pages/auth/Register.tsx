import { useNavigate } from 'react-router';
import { RegistrationForm } from '../../components/fragments/RegistrationForm';
import { PageContainer } from '../../components/layout/containers/PageContainer';

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/dashboard');
  };

  return (
    <PageContainer maxWidth="md">
      <RegistrationForm onSuccess={handleSubmit} />
    </PageContainer>
  );
}