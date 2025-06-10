import { useState } from "react";
import type { Nullable } from "../types/nullable";
import type { SafeUser } from "@homekeeper/shared";
import { AuthStatus, type AuthStatusType } from "../types/authStatus";
import { AuthActionsContext, AuthContext } from "./authContexts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatusType>(AuthStatus.CHECKING);
  const [csrfToken, setCsrfToken] = useState<Nullable<string>>(null);
  const [user, setUser] = useState<Nullable<SafeUser>>(null);

  return (
    <AuthContext value={{ authStatus, csrfToken, user }}>
      <AuthActionsContext value={{ setAuthStatus, setCsrfToken, setUser }}>
        {children}
      </AuthActionsContext>
    </AuthContext>
  );
}