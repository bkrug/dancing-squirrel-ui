import ReactDOM from 'react-dom/client';
import './index.css';
import CustomerPortal from './PageHeaders/CustomerPortal';
import OnboardCustomer from './Pages/OnboardCustomer/OnboardCustomer';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router';
import EmployeePortal from './PageHeaders/EmployeePortal';
import Employee from './Pages/Employee/Employee';
import CustomerSignup from './Pages/CustomerSignup/CustomerSignup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CustomerPortal child={<CustomerSignup />} />} />
      <Route path="employee" element={<EmployeePortal child={<Employee />} />} />
      <Route path="onboard/:trainingRequestId" element={<EmployeePortal child={<OnboardCustomer />} />} />
    </Routes>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
