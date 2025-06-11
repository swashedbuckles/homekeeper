import { PageContainer } from "../../components/common/PageContainer";
import { LoginForm } from "../../components/LoginForm";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <LoginForm onSuccess={handleClick} />
    </PageContainer>
  )
}