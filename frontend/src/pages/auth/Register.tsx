import { useNavigate } from "react-router";
import { PageContainer } from "../../components/common/PageContainer";
import { RegistrationForm } from "../../components/RegistrationForm";
import type { SafeUser } from "@homekeeper/shared";

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (user: SafeUser) => {
    console.log('hiii', user);
    navigate('/');
  };

  return (
    <PageContainer>
      <RegistrationForm onSuccess={handleSubmit} />
    </PageContainer>
  )
}