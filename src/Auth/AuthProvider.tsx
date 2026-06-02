import { Effect } from 'effect/index';
import { ReactNode, useEffect, useState } from 'react';
import { EditRoleModel } from '../dtoModels';
import { getParsedResponse } from '../Forms/Submission/formikSubmission';
import { AuthContext } from './AuthContext';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    getParsedResponse('authentication', EditRoleModel, 'GET')
      .then(result => {
        Effect.runPromise(Effect.match(result, {
          onSuccess: roleModel => {
            setIsAuthenticated(true);
            setRoles((roleModel.roles ?? []).map(r => r.name));
          },
          onFailure: () => setIsAuthenticated(false)
        }));
      });
  }, []);

  function setAuth(authenticated: boolean, newRoles: string[] = []) {
    setIsAuthenticated(authenticated);
    setRoles(authenticated ? newRoles : []);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
