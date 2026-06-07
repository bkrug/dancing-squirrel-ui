import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalTextInput } from '../../../Forms/Fields/LocalFields';
import { submitFormikJson } from '../../../Forms/Submission/formikSubmission';

interface ResetPasswordProps {
  userId?: string;
}

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordResetValidationFailures {
  oldPassword?: string;
  newPassword?: string;
}

const baseSchema = {
  newPassword: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Required'),
};

export default function ResetPassword({ userId }: ResetPasswordProps) {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const editingOwnData = userId === undefined || userId === null;
  const endpoint = editingOwnData ? 'user/self/password' : `user/${userId}/password`;

  return (
    <Formik<PasswordFormValues>
      initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
      validationSchema={Yup.object(
        editingOwnData
          ? { ...baseSchema, oldPassword: Yup.string().required('Required') }
          : baseSchema
      )}
      onSubmit={(values, actions) => {
        const payload = editingOwnData
          ? { newPassword: values.newPassword, oldPassword: values.oldPassword }
          : { newPassword: values.newPassword };
        submitFormikJson<PasswordFormValues, PasswordResetValidationFailures>(
          endpoint, payload as PasswordFormValues, actions, 'POST'
        ).then(parsedResponse => {
          setHasBeenSaved(parsedResponse.isSuccess);
        });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          {editingOwnData && <LocalTextInput label="Old Password" name="oldPassword" type="password" />}
          <LocalTextInput label="New Password" name="newPassword" type="password" />
          <LocalTextInput label="Confirm Password" name="confirmPassword" type="password" />
          <FeedbackSubmit label="Reset Password" formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
