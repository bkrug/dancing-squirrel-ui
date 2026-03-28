import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import "./SignupForm.css";
import parseToCamelCase from "../Forms/Submission/jsonParsing";
import FormResponse from '../Forms/Submission/formResponse';
import { LocalTextInput, LocalRadioInput } from '../Forms/Fields/LocalFields';

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
          <LocalRadioInput
            label="Caretaker Type"
            name="caretakerType"
            options={[
              { label: "Person", value: CaretakerType.Person.toString() },
              { label: "Company", value: CaretakerType.Company.toString() }
            ]} />
          <LocalTextInput label="Caretaker Name" name="caretakerName" />
          <LocalTextInput label="Email" name="email" type="email" />
          <LocalTextInput label="Phone" name="phone" type="tel" />
          <LocalTextInput label="Squirrel Name" name="squirrelName" />

          <button type="submit">Register Squirrel</button>
        </Form>
      )}
    </Formik>
  );
}