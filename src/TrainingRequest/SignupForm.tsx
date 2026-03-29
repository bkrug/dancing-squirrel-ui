import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import "./SignupForm.css";
import submitFormikForm from "../Forms/Submission/formikSubmission";
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
        submitFormikForm<TrainingRequestFormValues, TrainingRequestValidationFailures>(url, values, actions);
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