import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import './LoginForm.css';
import { submitUserCredentials } from '../Forms/Submission/formikSubmission';
import { LocalTextInput } from '../Forms/Fields/LocalFields';

class LoginFormValues {
  username: string = '';
  password: string = '';
}

class LoginValidationFailures {
  username: string = '';
  password: string = '';
}

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <Formik
      initialValues={new LoginFormValues()}
      validationSchema={
        Yup.object({
          username: Yup.string().required('Required'),
          password: Yup.string().required('Required')
        })
      }
      onSubmit={(values, actions) => {
        submitUserCredentials<LoginFormValues, LoginValidationFailures>('authentication', values, actions)
          .then(parsedResponse => {
            if (parsedResponse.isSuccess) onSuccess();
          });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          <LocalTextInput label="Username" name="username" type="text" />
          <LocalTextInput label="Password" name="password" type="password" />

          <button type="submit">Login</button>
        </Form>
      )}
    </Formik>
  );
}