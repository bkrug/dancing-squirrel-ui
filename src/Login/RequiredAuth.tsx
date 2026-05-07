import { PropsWithChildren, useCallback, useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import './RequiredAuth.css';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

let checkAuthentication = function () {
  let fullUrl = new URL('authentication', baseUrl);
  return fetch(fullUrl, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => {
    console.log(response);
    return response.ok;
  })
  .catch(() => false);
};

let logoutUser = function () {
  let fullUrl = new URL('authentication', baseUrl);  
  return fetch(fullUrl, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => response.ok)
  .catch(() => false);
}

//TODO: Store the state at a higher level like index.tsx so that we don't have to keep re-running this checkAuthentication() method.
export default function RequiredAuth({ children }: PropsWithChildren) {
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
        <div>
          <h2>Great Dancing Squirrel Corporation of North America</h2>
          <p><a href="/">Switch to Customer Portal</a></p>
        </div>
        <button onClick={makeLogoutRequest}>Logout</button>
      </header>
      {children}
    </div>
  )

  return (
    authed
    ? nodeWhenAuthorized
    : <LoginForm onSuccess={recordSuccessfulLogin} />);
}
