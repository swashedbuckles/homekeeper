import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/containers/PageContainer';
import { LoginForm } from '../../components/fragments/LoginForm';

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/');
  };

  return (
    <PageContainer maxWidth="md">
      <LoginForm onSuccess={handleClick} />
    </PageContainer>
  );
}