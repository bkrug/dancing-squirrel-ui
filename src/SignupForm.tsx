import React from "react";
import { useState } from "react";
import "./SignupForm.css";

class TrainingRequestValidationFailures {
  caretakerType: string = "";
  caretakerName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

function toCamelCase(key: string, value: any) {
  if (value && typeof value === 'object'){
    for (var k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value;
}

export default function useTrainingRequestForm() {
  const [errors, setErrors] = useState(new TrainingRequestValidationFailures())

  function postRequest(formData: FormData) {
    console.log(formData);
    fetch("http://localhost:5626/api/request/create", {
      method: "POST",
      body: formData
    })
    .then(response => response.status >= 400 ? response.text() : null )
    .then(jsonString => {
      if (!jsonString) return;
      //TODO: Use generics here
      let failures = Object.assign(new TrainingRequestValidationFailures(), JSON.parse(jsonString, toCamelCase));
      console.log('validation failure', failures)
      setErrors(failures);
    })
    .catch(httpErrors => {
      console.log(httpErrors);
      setErrors(httpErrors);
    });
  }

  console.log('errors from state', errors);  

  return (
    <form action={postRequest} method="POST">
      <div className="field">
        <label htmlFor="caretakertype">Caretaker Type</label>
        <div className="radiogroup">
          <input type="radio" name="caretakertype" id="company" value="company" defaultChecked />
          <label htmlFor="company">Company</label>
          <input type="radio" name="caretakertype" id="person" value="person" />
          <label htmlFor="person">Person</label>
        </div>
        {errors.caretakerType && <div className='error'>{errors.caretakerType}</div>}
      </div>
      <div className="field">
        <label htmlFor="caretakername">Caretaker Name</label>
        <input type="text" name="caretakername" required />
        {errors.caretakerName && <div className='error'>{errors.caretakerName}</div>}
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
        {errors.email && <div className='error'>{errors.email}</div>}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input type="tel" name="phone" />
        {errors.phone && <div className='error'>{errors.phone}</div>}
      </div>
      <div className="field">
        <label htmlFor="squirrelname">Squirrel Name</label>
        <input type="text" name="squirrelname" required />
        {errors.squirrelName && <div className='error'>{errors.squirrelName}</div>}
      </div>
      <button type="submit">Register Squirrel</button>
    </form>
  );
}