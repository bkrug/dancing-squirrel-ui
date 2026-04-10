import "./Employee.css";

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError("Base URL is not configured");

export default function Employee() {
  return (
    <div>Employee is already Logged in.</div>);
}
