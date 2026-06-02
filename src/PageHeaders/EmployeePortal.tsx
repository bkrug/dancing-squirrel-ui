import { ReactNode, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useHasRole } from '../Auth/AuthContext';
import { adminRole, onboarderRole } from '../Auth/roles';
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
  const isOnboarder = useHasRole(onboarderRole);
  const isAdmin = useHasRole(adminRole);
  const navigate = useNavigate();

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

  const nodeWhenAuthorized = (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <h2>Great Dancing Squirrel Corporation of North America</h2>
        <nav>
          {isOnboarder && <Link to='/trainingrequests'>Training Requests</Link>}
          {isAdmin && <Link to='/users'>Users</Link>}
        </nav>
        <button onClick={makeLogoutRequest}>Logout</button>
      </header>
      {child}
    </div>
  )

  const nodeWhenNotAuthorized = (
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
    ? nodeWhenAuthorized
    : nodeWhenNotAuthorized);
}
