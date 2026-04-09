import breakdancingSquirrel from "./breakdancing-squirrel.jpg";
import "./App.css";
import CustomerSignup from "./Pages/CustomerSignup/CustomerSignup";
import LoginForm from "./Login/LoginForm";
import { useCallback } from "react";

function App() {
  const makeTestRequest = useCallback(() => {
    const baseUrl = process.env.REACT_APP_BACKEND_API;
    if (!baseUrl) throw new TypeError("Base URL is not configured");
    let fullUrl = new URL("security/loginCheck", baseUrl);

    fetch(fullUrl, {
      method: "POST",
      mode: "cors",
      credentials: "include"
    })    
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={breakdancingSquirrel} className="App-logo" alt="breakdancing squirrel" />
        <h2>Great Dancing Squirrel Corporation of North America</h2>
        <p>
          In our world, the entertainment industry is now nearly monopolized by squirrel performers.
          A major subindustry involves dancing, and GDSC has decades of experience training and coaching squirrels to maximize their talents.
          Signup with us today to prepare your squirrel for the next great American musical or to awe a stadium full of fans.
        </p>
      </header>
      <div>
        <LoginForm onSuccess={makeTestRequest} />
      </div>
      <div>
        <CustomerSignup/>
      </div>
    </div>
  );
}

export default App;
