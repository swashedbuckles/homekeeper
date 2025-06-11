import { useNavigate } from "react-router";
import { PageContainer } from "../../components/common/PageContainer";
import { RegistrationForm } from "../../components/RegistrationForm";

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <RegistrationForm onSuccess={handleSubmit} />
    </PageContainer>
  )
}