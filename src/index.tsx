import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import AuthProvider from './Auth/AuthProvider';
import './index.css';
import CustomerPortal from './PageHeaders/CustomerPortal';
import EmployeePortal from './PageHeaders/EmployeePortal';
import CreateUser from './Pages/CreateUser/CreateUser';
import CustomerSignup from './Pages/CustomerSignup/CustomerSignup';
import EditUser from './Pages/EditUser/EditUser';
import OnboardCustomer from './Pages/OnboardCustomer/OnboardCustomer';
import TrainingRequestGrid from './Pages/TrainingRequestGrid/TrainingRequestGrid';
import UserGrid from './Pages/UserGrid/UserGrid';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<CustomerPortal child={<CustomerSignup />} />} />
      <Route path="landingpage" element={<EmployeePortal child={<div></div>} />} />
      <Route path="trainingrequests" element={<EmployeePortal child={<TrainingRequestGrid />} />} />
      <Route path="onboard/:trainingRequestId" element={<EmployeePortal child={<OnboardCustomer />} />} />
      <Route path="users" element={<EmployeePortal child={<UserGrid />} />} />
      <Route path="user-form/:userId" element={<EmployeePortal child={<EditUser />} />} />
      <Route path="registration-form" element={<EmployeePortal child={<CreateUser />} />} />
    </Routes>
    </AuthProvider>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
