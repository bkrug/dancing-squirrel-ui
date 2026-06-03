import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import FeedbackSubmit from '../../Forms/FeedbackSubmit';
import { LocalTextInput } from '../../Forms/Fields/LocalFields';
import { submitFormikJson } from '../../Forms/Submission/formikSubmission';
import { CreateUserModel } from '../../dtoModels';

class CreateUserValidationFailures {
  email: string = '';
  username: string = '';
  password: string = '';
  phoneNumber: string = '';
}

export default function CreateUser() {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={new CreateUserModel()}
      validationSchema={
        Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          username: Yup.string()
            .required('Required'),
          password: Yup.string()
            .required('Required'),
        })
      }
      onSubmit={(values, actions) => {
        submitFormikJson<CreateUserModel, CreateUserValidationFailures>('user', values, actions, 'POST')
          .then(parsedResponse => {
            setHasBeenSaved(parsedResponse.isSuccess);
            if (parsedResponse.isSuccess) navigate('/users');
          });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          <LocalTextInput label="Username" name="username"  disabled={hasBeenSaved}/>
          <LocalTextInput label="Password" name="password" type="password" disabled={hasBeenSaved}/>
          <LocalTextInput label="Email" name="email" type="email" disabled={hasBeenSaved} />
          <LocalTextInput label="Phone Number" name="phoneNumber" type="tel"  disabled={hasBeenSaved}/>

          <FeedbackSubmit label="Create User" formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
