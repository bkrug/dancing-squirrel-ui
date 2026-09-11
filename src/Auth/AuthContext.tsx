import { createContext, useContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
  // teacherId: number | null;
  setAuth: (isAuthenticated: boolean, roles?: string[], teacherId?: number | null) => void;
  refreshAuth: () => Promise<string[]>;
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  roles: [],
  // teacherId: null,
  setAuth: () => {},
  refreshAuth: () => Promise.resolve([]),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useHasRole(role: string) {
  const { roles } = useContext(AuthContext);
  return roles.includes(role);
}
