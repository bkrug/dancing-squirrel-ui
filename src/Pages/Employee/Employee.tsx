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

export default function Employee() {
  const [authed, setAuth] = useState(false);

  if (authed)
    testRequest();
  else
    checkAuthentication().then(isAuthenticated => setAuth(isAuthenticated));
  
  const makeTestRequest = useCallback(() => {
    setAuth(true);
    localStorage.setItem("authed", "true");
    testRequest(); 
  }, []);

  return (
    authed
    ? <div>Already Logged in.</div>
    : <LoginForm onSuccess={makeTestRequest} />);
}
