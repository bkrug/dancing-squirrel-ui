import { Effect } from 'effect/index';
import { ReactNode, useEffect, useState } from 'react';
import { Claim, ClaimResponse } from '../dtoModels';
import { getParsedResponse } from '../Forms/Submission/formikSubmission';
import { AuthContext } from './AuthContext';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

function getTeacherId(claims: Claim[]) {
  let teacherClaims = claims.filter(c => c.type === 'TeacherId');
  let teacherIdString = teacherClaims.length > 0 ? teacherClaims[0].value : null;
  return teacherIdString === null ? null : parseInt(teacherIdString || '', 10);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [teacherId, setTeacher] = useState<number|null>(null);

  async function refreshAuth(): Promise<string[]> {
    const result = await getParsedResponse('authentication', ClaimResponse, 'GET');
    let fetchedRoles: string[] = [];
    await Effect.runPromise(Effect.match(result, {
      onSuccess: claimRepone => {
        let claims = claimRepone.claims ?? [];
        fetchedRoles = claims.filter(c => c.type === 'Role').map(r => r.value);
        let teacherIdNumber = getTeacherId(claims);
        setIsAuthenticated(true);
        setRoles(fetchedRoles);
        setTeacher(teacherIdNumber);
      },
      onFailure: () => setIsAuthenticated(false)
    }));
    return fetchedRoles;
  }

  useEffect(() => { refreshAuth(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function setAuth(authenticated: boolean, newRoles: string[] = [], teacherId?: number | null) {
    setIsAuthenticated(authenticated);
    setRoles(authenticated ? newRoles : []);
    setTeacher(teacherId || null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, teacherId, setAuth, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}