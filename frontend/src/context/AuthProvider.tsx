import { useState } from "react";
import type { Nullable } from "../lib/types/nullable";
import type { SafeUser } from "@homekeeper/shared";
import { AuthStatus, type AuthStatusType } from "../lib/types/authStatus";
import { AuthActionsContext, AuthContext, type IAuthContext } from "./authContexts";

type AuthProviderProps = {
   children: React.ReactNode,
   initialState: IAuthContext,
};

const DEFAULT_INITIAL_STATE = {
  authStatus: AuthStatus.CHECKING,
  csrfToken: null,
  user: null,
};

export function AuthProvider({ children, initialState = DEFAULT_INITIAL_STATE }: AuthProviderProps) {
  const [authStatus, setAuthStatus] = useState<AuthStatusType>(initialState.authStatus);
  const [csrfToken, setCsrfToken] = useState<Nullable<string>>(initialState.csrfToken);
  const [user, setUser] = useState<Nullable<SafeUser>>(initialState.user);

  return (
    <AuthContext value={{ authStatus, csrfToken, user }}>
      <AuthActionsContext value={{ setAuthStatus, setCsrfToken, setUser }}>
        {children}
      </AuthActionsContext>
    </AuthContext>
  );
}