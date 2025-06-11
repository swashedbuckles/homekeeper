import type { SafeUser } from "@homekeeper/shared";
import { PageContainer } from "../../components/common/PageContainer";
import { LoginForm } from "../../components/LoginForm";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const handleClick = async (user: SafeUser) => {
    console.log('res!', user);
    navigate('/');
  };

  return (
    <PageContainer>
      <LoginForm onSuccess={handleClick} />
    </PageContainer>
  )
}