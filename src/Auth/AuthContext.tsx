import { createContext, useContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
  teacherId: number | null;
  setAuth: (isAuthenticated: boolean, roles?: string[], teacherId?: number | null) => void;
  getAuth: () => {
    isAuthenticated: boolean;
    roles: string[];
    teacherId: number | null;
  };
  refreshAuth: () => Promise<string[]>;
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  roles: [],
  teacherId: null,
  setAuth: () => {},
  getAuth: () => {
    return {
      isAuthenticated: false,
      roles: [] as string[],
      teacherId: null as number | null
    }
  },
  refreshAuth: () => Promise.resolve([]),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useHasRole(role: string) {
  const { roles } = useContext(AuthContext);
  return roles.includes(role);
}

export function useIsTeacher() {
  const { teacherId } = useContext(AuthContext);
  return teacherId !== null;
}
