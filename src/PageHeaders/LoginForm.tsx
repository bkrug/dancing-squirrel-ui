import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { LocalTextInput } from '../Forms/Fields/LocalFields';
import { submitFormikJson } from '../Forms/Submission/formikSubmission';
import './LoginForm.css';

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
        submitFormikJson<LoginFormValues, LoginValidationFailures>('authentication', values, actions, 'POST')
          .then(parsedResponse => parsedResponse.isSuccess && onSuccess());
      }}
    >
      {formik => (
        <Form className="login-form" onSubmit={formik.handleSubmit} method="POST">
          <LocalTextInput label="Username" name="username" type="text" />
          <LocalTextInput label="Password" name="password" type="password" />

          <button type="submit">Login</button>
        </Form>
      )}
    </Formik>
  );
}