import { createContext } from "react";
import type { Nullable } from "../types/nullable";
import type { SafeUser } from "@homekeeper/shared";
import { AuthStatus, type AuthStatusType } from "../types/authStatus";

export interface IAuthContext {
  authStatus: AuthStatusType;
  csrfToken:  Nullable<string>;
  user:       Nullable<SafeUser>;
};

export interface IAuthActionsContext{
  setAuthStatus: (status: AuthStatusType) => void;
  setCsrfToken: (token: Nullable<string>) => void;
  setUser: (user: Nullable<SafeUser>) => void;
}

export const AuthActionsContext = createContext<IAuthActionsContext>({
  setAuthStatus: () => {},
  setCsrfToken: () => {},
  setUser: () => {}
});

export const AuthContext = createContext<IAuthContext>({
  authStatus: AuthStatus.LOGGED_OUT,
  csrfToken:  null,
  user:       null,
});
