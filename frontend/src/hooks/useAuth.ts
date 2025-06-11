import { useContext } from "react";
import { AuthActionsContext, AuthContext } from "../context/authContexts";
import { authIsKnown, authIsLoading, AuthStatus } from "../lib/types/authStatus";
import * as authRequest from '../lib/api/auth';
import type { LoginRequest, SafeUser } from "@homekeeper/shared";

const isEmptyObject = (value: unknown): boolean => {
  return typeof value === 'object' 
    && value != null 
    && Object.keys(value).length === 0;
};

export function useAuth() {
  const context = useContext(AuthContext);
  const actions = useContext(AuthActionsContext);
  
  const isAuthenticated = context.authStatus === AuthStatus.LOGGED_IN;
  const isLoading       = authIsLoading(context.authStatus);
  const isKnown         = authIsKnown(context.authStatus);

  const checkAuth = async () => { 
    console.log('#checkAuth');
    // if(context.authStatus === AuthStatus.CHECKING) {
    //   console.log('#checkAuth already checking so return early.');
    //   return; 
    // }

    const originalStatus = context.authStatus;
    actions.setAuthStatus(AuthStatus.CHECKING);
    try {
      console.log('#checkAuth: make request');
      const result = await authRequest.getProfile();
      if(result.data != null && !isEmptyObject(result.data)) {
        console.log('#checkAuth got a user!');
        actions.setAuthStatus(AuthStatus.LOGGED_IN);
        actions.setUser(result.data);
      } else {
        console.log('#checkAuth: no user');
        actions.setAuthStatus(AuthStatus.LOGGED_OUT);
      }
    } catch(error) {
      console.error('#checkAuth: Error', error);
      actions.setAuthStatus(originalStatus);  // return from whence we came
      throw error; 
    }
  };

  const login = async ({email, password}: LoginRequest): Promise<SafeUser | undefined> => { 
    console.log('CONTEXT: LOGIN', {isAuthenticated, isLoading, isKnown, status: context.authStatus});
    if(!isAuthenticated && !isLoading) {
      console.log('Proceed with login');
      actions.setAuthStatus(AuthStatus.LOGGING_IN);
      try {
        const result = await authRequest.login(email, password);
        if(result.data != null) {
          actions.setAuthStatus(AuthStatus.LOGGED_IN);
          actions.setUser(result.data);

          return result.data;
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
