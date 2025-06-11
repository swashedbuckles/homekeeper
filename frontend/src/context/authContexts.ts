import { createContext } from "react";
import type { Nullable } from "../lib/types/nullable";
import type { SafeUser } from "@homekeeper/shared";
import { AuthStatus, type AuthStatusType } from "../lib/types/authStatus";

export interface IAuthContext {
  authStatus: AuthStatusType;
  user:       Nullable<SafeUser>;
};

export interface IAuthActionsContext{
  setAuthStatus: (status: AuthStatusType) => void;
  setUser: (user: Nullable<SafeUser>) => void;
}

export const AuthActionsContext = createContext<IAuthActionsContext>({
  setAuthStatus: () => {},
  setUser: () => {}
});

export const AuthContext = createContext<IAuthContext>({
  authStatus: AuthStatus.LOGGED_OUT,
  user:       null,
});
