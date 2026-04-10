import { useCallback, useState } from "react";
import "./Employee.css";
import LoginForm from "../../Login/LoginForm";

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError("Base URL is not configured");

let checkAuthentication = function () {
  let fullUrl = new URL("security/loginCheck", baseUrl);
  return fetch(fullUrl, {
    method: "POST",
    mode: "cors",
    credentials: "include"
  })
  .then(response => response.ok)
  .catch(() => false);
};

let testRequest = function() {
  let fullUrl = new URL("security/adminCheck", baseUrl);

  fetch(fullUrl, {
    method: "POST",
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

export default function Employee() {
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
    ? <div>Already Logged in.<button onClick={makeLogoutRequest}>Logout</button></div>
    : <LoginForm onSuccess={makeTestRequest} />);
}
