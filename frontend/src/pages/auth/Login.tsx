import { useNavigate } from 'react-router';
import { LoginForm } from '../../components/fragments/LoginForm';
import { PageContainer } from '../../components/layout/containers/PageContainer';

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