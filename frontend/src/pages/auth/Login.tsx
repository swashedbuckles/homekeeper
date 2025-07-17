import { useNavigate } from 'react-router';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { LoginForm } from '../../components/fragments/LoginForm';
import { NarrowContainer } from '../../components/layout/containers/NarrowContainer';
import { SectionTitle } from '../../components/variations/SectionTitle';

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/');
  };

  return (
    <NarrowContainer maxWidth="md">
      <Card>
        <SectionTitle>Welcome Back!</SectionTitle>
        <Text className="block mb-4" color="secondary" uppercase>Sign in to your account</Text>
        <LoginForm onSuccess={handleClick} />
      </Card>
    </NarrowContainer>
  );
}