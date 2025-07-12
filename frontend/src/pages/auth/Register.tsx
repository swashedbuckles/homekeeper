import { useNavigate } from 'react-router';
import { RegistrationForm } from '../../components/fragments/RegistrationForm';
import { NarrowContainer } from '../../components/layout/containers/NarrowContainer';

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/dashboard');
  };

  return (
    <NarrowContainer maxWidth="md">
      <RegistrationForm onSuccess={handleSubmit} />
    </NarrowContainer>
  );
}