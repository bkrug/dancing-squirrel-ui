import breakdancingSquirrel from "./breakdancing-squirrel.jpg";
import "./App.css";
import TrainingRequestForm from "./TrainingRequest/SignupForm";
import LoginForm from "./Login/LoginForm";
import { useState, useCallback } from "react";

function App() {
  let [isComplete, setComplete] = useState(false);
  const onCompletion = useCallback(() => {
    setComplete(true)
  }, []);
  const makeTestRequest = useCallback(() => {
    const baseUrl = process.env.REACT_APP_BACKEND_API;
    if (!baseUrl) throw new TypeError("Base URL is not configured");
    let fullUrl = new URL("api/security/loginCheck", baseUrl);

    fetch(fullUrl, {
      method: "POST"
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
        {!isComplete
          ? <TrainingRequestForm onSuccess={onCompletion} />
          : (<><h1>Successful Submission</h1>Our representative will reach out to you.</>)
        }
      </div>
    </div>
  );
}

export default App;
