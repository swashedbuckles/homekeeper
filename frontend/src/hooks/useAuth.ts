import { useContext } from 'react';
import { AuthActionsContext, AuthContext } from '../context/authContexts';
import * as authRequest from '../lib/api/auth';
import { STATE as logger } from '../lib/logger';
import { authIsKnown, authIsLoading, AuthStatus } from '../lib/types/authStatus';
import type { LoginRequest, SafeUser } from '@homekeeper/shared';

const isEmptyObject = (value: unknown): boolean => {
  return typeof value === 'object' 
    && value != null 
    && Object.keys(value).length === 0;
};

let isChecking = false; // prevent duplicate checks before status updates. 
export function useAuth() {
  const context = useContext(AuthContext);
  const actions = useContext(AuthActionsContext);
  
  const isAuthenticated = context.authStatus === AuthStatus.LOGGED_IN;
  const isLoading       = authIsLoading(context.authStatus);
  const isKnown         = authIsKnown(context.authStatus);

  const checkAuth = async () => { 
    logger.log('#checkAuth');
    const originalStatus = context.authStatus;
    if(originalStatus === AuthStatus.CHECKING || isChecking) {
      return;
    }
    
    isChecking = true;
    actions.setAuthStatus(AuthStatus.CHECKING);

    try {
      logger.log('#checkAuth: validate session');
      await authRequest.validateSession();
      
      logger.log('#checkAuth: session valid, get profile');
      const result = await authRequest.getProfile();
      if(result.data != null && !isEmptyObject(result.data)) {
        logger.log('#checkAuth got a user!');
        actions.setAuthStatus(AuthStatus.LOGGED_IN);
        actions.setUser(result.data);
      } else {
        logger.log('#checkAuth: session valid but no user data');
        actions.setAuthStatus(AuthStatus.LOGGED_OUT);
      }
    } catch(error) {
      logger.error('#checkAuth: Session validation failed', error);
      actions.setAuthStatus(AuthStatus.LOGGED_OUT);
    } finally {
      isChecking = false;
    }
  };

  const login = async ({email, password}: LoginRequest): Promise<SafeUser | undefined> => { 
    logger.log('CONTEXT: LOGIN', {isAuthenticated, isLoading, isKnown, status: context.authStatus});
    if(!isAuthenticated && !isLoading) {
      logger.log('Proceed with login');
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
