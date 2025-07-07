import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { PageContainer } from '../components/containers/PageContainer';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const navigate = useNavigate();
  const context = useAuth();
  
  const householdRoles = context.user?.householdRoles;

  useEffect(() => {
    const IS_DEV = !import.meta.env.PROD;
    if(!IS_DEV && (!householdRoles || Object.keys(householdRoles).length === 0)) {
      navigate('/onboarding');
    }
  }, [context, householdRoles, navigate]);


  return (
    <>
      <PageContainer>
        <p>Dashboard Page</p>
      </PageContainer>
    </>
  );
}