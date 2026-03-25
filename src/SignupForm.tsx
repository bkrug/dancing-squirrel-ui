import React from "react";
import { useState } from "react";
import "./SignupForm.css";

class TrainingRequestValidationFailures {
  caretakerType: string = "";
  caretakerName: string = "";
  email: string = "";
  phone: string = "not a valid phone number";
  squirrelName: string = "";
}

export default function useTrainingRequestForm() {
  const [errors, setErrors] = useState(new TrainingRequestValidationFailures())

  function postRequest(formData: FormData) {
    console.log(formData);
    fetch("http://localhost:5626/api/request/create", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Record saved", data);
    })
    .catch(errors => {
      console.log(errors);
      setErrors(errors);
    });
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
        {errors.caretakerType && <div className='error'>{errors.caretakerType}</div>}
      </div>
      <p>
        <label htmlFor="caretakername">Caretaker Name</label>
        <input type="text" name="caretakername" required />
        {errors.caretakerName && <div className='error'>{errors.caretakerName}</div>}
      </p>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
        {errors.email && <div className='error'>{errors.email}</div>}
      </p>
      <p>
        <label htmlFor="phone">Phone</label>
        <input type="tel" name="phone" />
        {errors.phone && <div className='error'>{errors.phone}</div>}
      </p>
      <p>
        <label htmlFor="squirrelname">Squirrel Name</label>
        <input type="text" name="squirrelname" required />
        {errors.squirrelName && <div className='error'>{errors.squirrelName}</div>}
      </p>
      <button type="submit">Register Squirrel</button>
    </form>
  );
}