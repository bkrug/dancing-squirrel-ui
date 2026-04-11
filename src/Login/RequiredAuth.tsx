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
  .then(response => {
    console.log(response);
    return response.ok;
  })
  .catch(() => false);
};

let logoutUser = function () {
  let fullUrl = new URL("authentication", baseUrl);  
  return fetch(fullUrl, {
    method: "DELETE",
    mode: "cors",
    credentials: "include"
  })
  .then(response => response.ok)
  .catch(() => false);
}

//TODO: Store the state at a higher level like index.tsx so that we don't have to keep re-running this checkAuthentication() method.
export default function RequiredAuth({ children }: PropsWithChildren) {
  const [authed, setAuth] = useState(null as boolean | null);
  if (authed === null)
    checkAuthentication().then(isAuthenticated => setAuth(isAuthenticated));
  
  const makeLogoutRequest = function() {
    logoutUser().then(logoutSuccessful => setAuth(!logoutSuccessful));
  }

  const recordSuccessfulLogin = useCallback(() => setAuth(true), []);

  return (
    authed
    ? <>
        <button onClick={makeLogoutRequest}>Logout</button>
        {children}
      </>
    : <LoginForm onSuccess={recordSuccessfulLogin} />);
}
