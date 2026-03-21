import React from "react";
import "./SignupForm.css";

export default function getTrainingRequestForm() {
  return (
    <form action="training-request/create" method="POST">
      <p>
        <label htmlFor="caretakertype">Caretaker Type</label>
        <div className="radiogroup">
          <input type="radio" name="caretakertype" id="company" value="company" defaultChecked />
          <label htmlFor="company">Company</label>
          <input type="radio" name="caretakertype" id="person" value="person" />
          <label htmlFor="person">Person</label>
        </div>
      </p>
      <p>
        <label htmlFor="caretakername">Caretaker Name</label>
        <input type="text" name="caretakername" />
      </p>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
      </p>
      <p>
        <label htmlFor="phone">Phone</label>
        <input type="text" name="phone" />
      </p>
      <p>
        <label htmlFor="squirrelname">Squirrel Name</label>
        <input type="text" name="squirrelname" />
      </p>
      <button type="submit">Register Squirrel</button>
    </form>
  );
}