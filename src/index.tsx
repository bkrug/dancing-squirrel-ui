import ReactDOM from 'react-dom/client';
import './index.css';
import PortalCustomer from './PageHeaders/PortalCustomer';
import OnboardCustomer from './Pages/OnboardCustomer/OnboardCustomer';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router';
import RequiredAuth from './PageHeaders/RequiredAuth';
import Employee from './Pages/Employee/Employee';
import CustomerSignup from './Pages/CustomerSignup/CustomerSignup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PortalCustomer child={<CustomerSignup />} />} />
      <Route path="employee" element={<RequiredAuth><Employee /></RequiredAuth>} />
      <Route path="onboard/:trainingRequestId" element={<RequiredAuth><OnboardCustomer /></RequiredAuth>} />
    </Routes>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
