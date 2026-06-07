import { Effect } from 'effect/index';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useHasRole } from '../Auth/AuthContext';
import { adminRole, onboarderRole } from '../Auth/roles';
import { getParsedResponse } from '../Forms/Submission/formikSubmission';
import { ViewUserModel } from '../dtoModels';
import LoginForm from './LoginForm';
import './PageHeader.css';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

let logoutUser = async function () {
  let fullUrl = new URL('authentication', baseUrl);
  try {
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    });
    return response.ok;
  } catch {
    return false;
  }
}

//Note that an alternative is to use the built-in react PropsWithChildren type.
//I just like this approach better because I think it results in less code in index.tsx
interface EmployeePortalProps {
  child: ReactNode
}

export default function EmployeePortal({ child }: EmployeePortalProps) {
  const { isAuthenticated, setAuth, refreshAuth } = useAuth();
  const [ username, setUsername ] = useState('');
  const isOnboarder = useHasRole(onboarderRole);
  const isAdmin = useHasRole(adminRole);
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated && getParsedResponse('user/self', ViewUserModel)
    .then(result => Effect.runPromise(Effect.match(result, {
      onSuccess: viewModel => setUsername(viewModel.username),
      onFailure: () => {}
    })))
  }, [isAuthenticated]);

  const makeLogoutRequest = function() {
    logoutUser().then(logoutSuccessful => { if (logoutSuccessful) setAuth(false); });
  }

  const recordSuccessfulLogin = useCallback(async () => {
    let roles = await refreshAuth();
    if (roles.includes(onboarderRole))
      navigate('/trainingrequests', { replace: true });
    else if (roles.includes(adminRole))
      navigate('/users', { replace: true });
  }, [refreshAuth, navigate]);

  const nodeWhenAuthenticated = (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <h2>Great Dancing Squirrel Corporation of North America</h2>
        <nav>
          {isOnboarder && <Link to='/trainingrequests'>Training Requests</Link>}
          {isAdmin && <Link to='/users'>Users</Link>}
          <Link to='/user-form/self'>Profile of {username}</Link>
        </nav>
        <button onClick={makeLogoutRequest}>Logout</button>
      </header>
      {child}
    </div>
  )

  const nodeWhenNotAuthenticated = (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <div>
          <h2>Great Dancing Squirrel Corporation of North America</h2>
          <p><a href="/">Switch to Customer Portal</a></p>
        </div>
      </header>
      <LoginForm onSuccess={recordSuccessfulLogin} />
    </div>
  )

  return (
    isAuthenticated
    ? nodeWhenAuthenticated
    : nodeWhenNotAuthenticated);
}
