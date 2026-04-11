//TODO: Reduce duplicate styling
import "./Employee.css";

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError("Base URL is not configured");

let getExistingTrainingRequests = function() {
  let fullUrl = new URL("request", baseUrl);

  fetch(fullUrl, {
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
  .then(response => console.log(response.text()));
};

export default function Employee() {
  getExistingTrainingRequests();
  return (
    <div>Employee is already Logged in.</div>
  );
}
