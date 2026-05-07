import './Portal.css';
import { ReactNode } from 'react';

function PortalEmployee({ child } : { child: ReactNode }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/breakdancing-squirrel.jpg`} className="App-logo" alt="breakdancing squirrel" />
        <div>
          <h2>Great Dancing Squirrel Corporation of North America</h2>
          <p><a href="/">Switch to Customer Portal</a></p>
        </div>
      </header>
      {child}
    </div>
  );
}

export default PortalEmployee;
