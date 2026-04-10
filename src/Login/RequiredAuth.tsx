import { PropsWithChildren, useCallback, useState } from "react";
import LoginForm from "./LoginForm";

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError("Base URL is not configured");

let checkAuthentication = function () {
  let fullUrl = new URL("authentication", baseUrl);
  return fetch(fullUrl, {
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
  .then(response => response.ok)
  .catch(() => false);
};

let testRequest = function() {
  let fullUrl = new URL("authorization/admin", baseUrl);

  fetch(fullUrl, {
    method: "GET",
    mode: "cors",
    credentials: "include"
  });
};

let logoutUser = function () {
  let fullUrl = new URL("security/logout", baseUrl);  
  return fetch(fullUrl, {
    method: "POST",
    mode: "cors",
    credentials: "include"
  })
  .then(response => response.ok)
  .catch(() => false);  
}

//TODO: Store the state at a higher level like index.tsx so that we don't have to keep re-running this checkAuthentication() method.
//BUG: checkAuthentication() is getting called directly after logging out. This is not necessary.
export default function RequiredAuth({ children }: PropsWithChildren) {
  const [authed, setAuth] = useState(false);

  if (authed)
    testRequest();
  else
    checkAuthentication().then(isAuthenticated => setAuth(isAuthenticated));
  
  const makeTestRequest = useCallback(() => {
    setAuth(true);
    testRequest(); 
  }, []);

  const makeLogoutRequest = function() {
    logoutUser().then(logoutSuccessful => setAuth(!logoutSuccessful));
  }

  return (
    authed
    ? <>
        <button onClick={makeLogoutRequest}>Logout</button>
        {children}
      </>
    : <LoginForm onSuccess={makeTestRequest} />);
}
