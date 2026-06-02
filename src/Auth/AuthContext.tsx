import { createContext, useContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
  setAuth: (isAuthenticated: boolean, roles?: string[]) => void;
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  roles: [],
  setAuth: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useHasRole(role: string) {
  const { roles } = useContext(AuthContext);
  return roles.includes(role);
}
