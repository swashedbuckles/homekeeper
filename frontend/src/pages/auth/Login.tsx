import { useNavigate } from 'react-router';
import { LoginForm } from '../../components/fragments/LoginForm';
import { NarrowContainer } from '../../components/layout/containers/NarrowContainer';

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/');
  };

  return (
    <NarrowContainer maxWidth="md">
      <LoginForm onSuccess={handleClick} />
    </NarrowContainer>
  );
}