import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import "./SignupForm.css";
import submitFormikForm from "../Forms/Submission/formikSubmission";
import { LocalTextInput, LocalRadioInput } from '../Forms/Fields/LocalFields';

enum CaretakerType { Empty, Person, Company };

class TrainingRequestFormValues {
  caretakerType: CaretakerType = CaretakerType.Person;
  caretakerFirstName: string = "";
  caretakerLastName: string = "";
  caretakerCompanyName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

class TrainingRequestValidationFailures {
  caretakerType: string = "";
  caretakerFirstName: string = "";
  caretakerLastName: string = "";
  caretakerCompanyName: string = "";
  email: string = "";
  phone: string = "";
  squirrelName: string = "";
}

export default function TrainingRequestForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <Formik
      initialValues={new TrainingRequestFormValues()}
      validationSchema={
        Yup.object({
          caretakerCompanyName: Yup.string()
            .when('caretakerType', {
              is: (value: any) => value.toString()===CaretakerType.Company.toString(),
              then: (schema) => schema.required('Required'),
              otherwise: (schema) => schema.notRequired()
            }),
          caretakerFirstName: Yup.string()
            .when('caretakerType', {
              is: (value: any) => value.toString()===CaretakerType.Person.toString(),
              then: (schema) => schema.required('Required'),
              otherwise: (schema) => schema.notRequired()
            }),
          caretakerLastName: Yup.string()
            .when('caretakerType', {
              is: (value: any) => value.toString()===CaretakerType.Person.toString(),
              then: (schema) => schema.required('Required'),
              otherwise: (schema) => schema.notRequired()
            }),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          squirrelName: Yup.string()
            .required('Required'),
        })
      }
      onSubmit={(values, actions) => {
        submitFormikForm<TrainingRequestFormValues, TrainingRequestValidationFailures>("request/create", values, actions)
          .then(parsedResponse => {
            if (parsedResponse.isSuccess) onSuccess();
          });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          <fieldset>
            <legend>Owner/Caretaker Details</legend>
            <LocalRadioInput
              label="Type"
              name="caretakerType"
              options={[
                { label: "Person", value: CaretakerType.Person.toString() },
                { label: "Company", value: CaretakerType.Company.toString() }
              ]} />
            {
              formik.values.caretakerType.toString() === CaretakerType.Person.toString()
              ? (
                <>
                  <LocalTextInput label="First Name" name="caretakerFirstName" />
                  <LocalTextInput label="Last Name" name="caretakerLastName" />
                </>
              )
              : (
                <LocalTextInput label="Organization Name" name="caretakerCompanyName" />
              )
            }
            <LocalTextInput label="Email" name="email" type="email" />
            <LocalTextInput label="Phone" name="phone" type="tel" />
          </fieldset>
          <LocalTextInput label="Squirrel Name" name="squirrelName" />

          <button type="submit">Register Squirrel</button>
        </Form>
      )}
    </Formik>
  );
}