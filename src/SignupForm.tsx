import React from "react";
import "./SignupForm.css";

export default function getTrainingRequestForm() {
  function postRequest(formData: FormData) {
    console.log(formData);
    fetch("/api/request/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Record saved", data);
    })
    .catch(error => console.log(error));
  }  
  return (
    <form action={postRequest} method="POST">
      <div>
        <label htmlFor="caretakertype">Caretaker Type</label>
        <div className="radiogroup">
          <input type="radio" name="caretakertype" id="company" value="company" defaultChecked />
          <label htmlFor="company">Company</label>
          <input type="radio" name="caretakertype" id="person" value="person" />
          <label htmlFor="person">Person</label>
        </div>
      </div>
      <p>
        <label htmlFor="caretakername">Caretaker Name</label>
        <input type="text" name="caretakername" required />
      </p>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
      </p>
      <p>
        <label htmlFor="phone">Phone</label>
        <input type="text" name="phone" />
      </p>
      <p>
        <label htmlFor="squirrelname">Squirrel Name</label>
        <input type="text" name="squirrelname" required />
      </p>
      <button type="submit">Register Squirrel</button>
    </form>
  );
}