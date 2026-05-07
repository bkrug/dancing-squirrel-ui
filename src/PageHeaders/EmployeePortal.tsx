import { useCallback, useState, useEffect, ReactNode } from 'react';
import LoginForm from './LoginForm';
import './PageHeader.css';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

let checkAuthentication = async function () {
  let fullUrl = new URL('authentication', baseUrl);
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    console.log(response);
    return response.ok;
  } catch {
    return false;
  }
};

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

//TODO: Store the state at a higher level like index.tsx so that we don't have to keep re-running this checkAuthentication() method.
export default function EmployeePortal({ child }: EmployeePortalProps) {
  const [authed, setAuth] = useState(null as boolean | null);

  useEffect(() => {
    checkAuthentication().then(isAuthenticated => setAuth(isAuthenticated));
  }, [authed]);  
  
  const makeLogoutRequest = function() {
    logoutUser().then(logoutSuccessful => setAuth(!logoutSuccessful));
  }

  const recordSuccessfulLogin = useCallback(() => setAuth(true), []);

  const nodeWhenAuthorized = (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <h2>Great Dancing Squirrel Corporation of North America</h2>
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
    authed
    ? nodeWhenAuthorized
    : nodeWhenNotAuthorized);
}
