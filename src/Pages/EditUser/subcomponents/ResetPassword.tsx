import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalTextInput } from '../../../Forms/Fields/LocalFields';
import { submitFormikJson } from '../../../Forms/Submission/formikSubmission';
import { OwnPasswordResetModel } from '../../../dtoModels';

interface PasswordResetValidationFailures extends OwnPasswordResetModel {}

class PasswordResetForm extends OwnPasswordResetModel {
  confirmNewPassword: string = '';
}

export default function ResetPassword() {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  return (
    <Formik
      initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' } as PasswordResetForm}
      validationSchema={Yup.object({
        oldPassword: Yup.string().required('Required'),
        newPassword: Yup.string().required('Required'),
        confirmNewPassword: Yup.string()
          .oneOf([Yup.ref('newPassword')], 'Passwords must match')
          .required('Required'),
      })}
      onSubmit={(values, actions) => {
        const model = Object.assign(
          new PasswordResetForm(),
          values
        );
        model.confirmNewPassword = '';
        submitFormikJson<PasswordResetForm, PasswordResetValidationFailures>(
          'user/self/password',
          model,
          actions,
          'POST'
        ).then(parsedResponse => {
          setHasBeenSaved(parsedResponse.isSuccess);
        });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method='POST'>
          <LocalTextInput label='Old Password' name='oldPassword' type='password' />
          <LocalTextInput label='New Password' name='newPassword' type='password' />
          <LocalTextInput label='Confirm New Password' name='confirmNewPassword' type='password' />
          <FeedbackSubmit label='Reset Password' formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
