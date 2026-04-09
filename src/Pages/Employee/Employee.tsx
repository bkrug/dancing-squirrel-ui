import { useCallback } from "react";
import "./Employee.css";
import LoginForm from "../../Login/LoginForm";

export default function Employee() {
  const makeTestRequest = useCallback(() => {
    const baseUrl = process.env.REACT_APP_BACKEND_API;
    if (!baseUrl) throw new TypeError("Base URL is not configured");
    let fullUrl = new URL("security/loginCheck", baseUrl);

    fetch(fullUrl, {
      method: "POST",
      mode: "cors",
      credentials: "include"
    })    
  }, []);

  return (<LoginForm onSuccess={makeTestRequest} />);
}
