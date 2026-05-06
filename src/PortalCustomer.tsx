import './Portal.css';
import CustomerSignup from './Pages/CustomerSignup/CustomerSignup';

function PortalCustomer() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <div>
          <h2>Great Dancing Squirrel Corporation of North America</h2>
          <p>In our world, the entertainment industry is now nearly monopolized by squirrel performers.</p>
          <p>A major subindustry involves dancing, and GDSC has decades of experience training and coaching squirrels to maximize their talents.</p>
          <p>Signup with us today to prepare your squirrel for the next great American musical or to awe a stadium full of fans.</p>
          <p><a href="/employee">Switch to Employee Portal</a></p>
        </div>
      </header>
      <CustomerSignup />
    </div>
  );
}

export default PortalCustomer;
