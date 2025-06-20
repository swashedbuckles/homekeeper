import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const navigate = useNavigate();
  const context = useAuth();
  
  const householdRoles = context.user?.householdRoles;

  useEffect(() => {
    if(!householdRoles || Object.keys(householdRoles).length === 0) {
      navigate('/onboarding');
    }
  }, [context, householdRoles, navigate]);


  return (
    <>
      <div>
        <p>Dashboard Page</p>
      </div>
    </>
  );
}