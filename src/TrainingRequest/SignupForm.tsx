import { FC } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import "./SignupForm.css";
import parseToCamelCase from "../FormSubmission/jsonParsing";
import FormResponse from '../FormSubmission/formResponse';

interface TextInputProps {
  label: string,
  name: string,
  type?: string
}

const SquirrelTextInput: FC<TextInputProps> = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  props.type = props.type || "text";
  console.log("calculatedType", props.type);
  const [field, meta] = useField(props);
  return (
    <div className="field">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
    </div>
  );
};

enum CaretakerType { Empty, Person, Company };

class TrainingRequestFormValues {
  caretakerType: CaretakerType = CaretakerType.Person;
  caretakerName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

class TrainingRequestValidationFailures {
  caretakerType: string = "";
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
        let url = "http://localhost:5626/api/request/create";
        //Need generics for FormValues class and ValidationFailures class
        //Need to create FormData object from reflection

        let formData = new FormData();
        formData.append("caretakerType", values.caretakerType.toString());
        formData.append("caretakerName", values.caretakerName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("squirrelName", values.squirrelName);

        fetch(url, {
          method: "POST",
          body: formData
        })
        .then(response => response.text() )
        .then(jsonString => {
          let parsedResponse = parseToCamelCase(FormResponse<TrainingRequestValidationFailures>, jsonString);
          if (parsedResponse.isSuccess) {
            actions.resetForm();
          }
          else if (parsedResponse.validationFailuresStrict){
            actions.setErrors(parsedResponse.validationFailuresStrict);
          }
          else if (parsedResponse.isInternalError) {
            alert("An internal error occurred.");
          }
          else {
            alert("A malformed response was received from the server.");
          }
          actions.setSubmitting(false);
        })
        .catch(httpErrors => {
          console.error(httpErrors);
          alert("An HTTP error occurred.");
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

          <SquirrelTextInput label="Caretaker Name" name="caretakerName" />
          <SquirrelTextInput label="Email" name="email" type="email" />
          <SquirrelTextInput label="Phone" name="phone" type="tel" />
          <SquirrelTextInput label="Squirrel Name" name="squirrelName" />

          <button type="submit">Register Squirrel</button>
        </Form>
      )}
    </Formik>
  );
}