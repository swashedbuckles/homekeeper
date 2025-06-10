import { useContext } from "react";
import { AuthActionsContext, AuthContext } from "../context/authContexts";
import { authIsKnown, authIsLoading, AuthStatus } from "../types/authStatus";
import * as authRequest from '../lib/api/auth';
import type { LoginRequest } from "@homekeeper/shared";
import { API_BASE_URL } from "../lib/apiClient";

export function useAuth() {
  const context = useContext(AuthContext);
  const actions = useContext(AuthActionsContext);
  
  const isAuthenticated = context.authStatus === AuthStatus.LOGGED_IN;
  const isLoading       = authIsLoading(context.authStatus);
  const isKnown         = authIsKnown(context.authStatus);

  const checkAuth = async () => { 
    const originalStatus = context.authStatus;
    actions.setAuthStatus(AuthStatus.CHECKING);
    
    try {
      const result = await authRequest.getProfile();
      if(result.data != null) {
        actions.setAuthStatus(AuthStatus.LOGGED_IN);
        actions.setUser(result.data);
      } else {
        actions.setAuthStatus(AuthStatus.LOGGED_OUT);
      }
    } catch (error) {
      actions.setAuthStatus(originalStatus);  // return from whence we came
      throw error;
    }
  };

  const login = async ({email, password}: LoginRequest) => { 
    if(!isAuthenticated && !isLoading) {
      actions.setAuthStatus(AuthStatus.LOGGING_IN);
      try {
        const result = await authRequest.login(email, password);
        if(result.data != null) {
          actions.setAuthStatus(AuthStatus.LOGGED_IN);
          actions.setUser(result.data);
          
          const token = await getCsrfToken();
          actions.setCsrfToken(token);  /** @todo retry/error handling for logged-in but no token state */
        } else {
          actions.setAuthStatus(AuthStatus.LOGGED_OUT);
        }
      } catch(error){
        actions.setAuthStatus(AuthStatus.LOGGED_OUT);
        throw error;
      }
    }
   };
  const logout = async () => { 
    const originalStatus = context.authStatus;
    try {
      if(isAuthenticated && !isLoading) {
        actions.setAuthStatus(AuthStatus.LOGGING_OUT);
        await authRequest.logout();
  
        actions.setAuthStatus(AuthStatus.LOGGED_OUT);
        actions.setUser(null);
        actions.setCsrfToken(null);
      }
    } catch (error) {
      /** @todo do we do something else here? */
      actions.setAuthStatus(originalStatus);

      throw error;
    }
  };
  
  return {
    // State
    authStatus: context.authStatus,
    csrfToken: context.csrfToken,
    user: context.user,
    
    // Actions
    checkAuth,
    login,
    logout,
    
    // Computed/helper values
    isLoading,
    isKnown,
    isAuthenticated,
  };
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: 'include'
  });
  const data = await response.json();
  return data.csrfToken;
};