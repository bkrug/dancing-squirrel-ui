import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import "./SignupForm.css";
import parseToCamelCase from "./jsonParsing";

class TrainingRequestValidationFailures {
  caretakerType: string = "";
  caretakerName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

class TrainingRequestResponse {
  isSuccess: boolean = false;
  isInternalError: boolean = false;
  validationFailures: TrainingRequestValidationFailures = new TrainingRequestValidationFailures();
}

enum CaretakerType { Empty, Person, Company };

class TrainingRequestFormValues {
  caretakerType: CaretakerType = CaretakerType.Person;
  caretakerName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

export default function useTrainingRequestForm() {
  return (
    <Formik
      initialValues={new TrainingRequestFormValues()}
      validationSchema={Yup.object({
        caretakerName: Yup.string()
          .required('Required'),
        email: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        squirrelName: Yup.string()
          .required('Required'),
        })}
      onSubmit={(values, actions) => {
        let formData = new FormData();
        formData.append("caretakerType", values.caretakerType.toString());
        formData.append("caretakerName", values.caretakerName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("squirrelName", values.squirrelName);
        fetch("http://localhost:5626/api/request/create", {
          method: "POST",
          body: formData
        })
        .then(response => response.text() )
        .then(jsonString => {
          let parsedResponse = parseToCamelCase(TrainingRequestResponse, jsonString);
          if (parsedResponse.isSuccess) {
            actions.resetForm();
          }
          else if (parsedResponse.validationFailures){
            actions.setErrors(parsedResponse.validationFailures);
          }
          else if (parsedResponse.isInternalError) {
            alert("An internal error occurred.");
          }
          else {
            alert("An error occurred.");
          }
          actions.setSubmitting(false);
        })
        .catch(httpErrors => {
          console.error(httpErrors);
          alert("An internal error occurred.");
          actions.setSubmitting(false);
        });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">

          <div className="field">
            <label htmlFor="caretakerType">Caretaker Type</label>
            <div className="radiogroup">
              <input
                id="company"
                type="radio"
                name="caretakerType"
                value={CaretakerType.Company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultChecked={formik.values.caretakerType===CaretakerType.Company}
              />
              <label htmlFor="company">Company</label>
              <input
                id="person"
                type="radio"
                name="caretakerType"
                value={CaretakerType.Person}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultChecked={formik.values.caretakerType===CaretakerType.Person}
              />
              <label htmlFor="person">Person</label>
            </div>
            {formik.touched.caretakerType && formik.errors.caretakerType && <div className='error'>{formik.errors.caretakerType}</div>}
          </div>

          <div className="field">
            <label htmlFor="caretakerName">Caretaker Name</label>
            <Field name="caretakerName" type="text"/>
            {formik.touched.caretakerName && formik.errors.caretakerName && <div className='error'>{formik.errors.caretakerName}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <Field name="email" type="email"/>
            {formik.touched.email && formik.errors.email && <div className='error'>{formik.errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <Field name="phone" type="tel"/>
            {formik.touched.phone && formik.errors.phone && <div className='error'>{formik.errors.phone}</div>}
          </div>

          <div className="field">
            <label htmlFor="squirrelName">Squirrel Name</label>
            <Field name="squirrelName" type="text"/>
            {formik.touched.squirrelName && formik.errors.squirrelName && <div className='error'>{formik.errors.squirrelName}</div>}
          </div>

          <button type="submit">Register Squirrel</button>
        </Form>
      )}
    </Formik>
  );
}