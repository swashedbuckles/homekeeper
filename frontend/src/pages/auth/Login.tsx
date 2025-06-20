import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/common/PageContainer';
import { LoginForm } from '../../components/fragments/LoginForm';

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <LoginForm onSuccess={handleClick} />
    </PageContainer>
  );
}