import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { LocalTextInput } from '../../../Forms/Fields/LocalFields';
import { submitFormikJson } from '../../../Forms/Submission/formikSubmission';
import { EditUserModel } from '../../../dtoModels';

class EditUserValidationFailures {
  email: string = '';
  phoneNumber: string = '';
}

interface ContactFieldFormProps {
  editModel: EditUserModel;
  username: string | undefined;
  userId: string | undefined;
}

export default function ContactFieldForm({ editModel, username, userId }: ContactFieldFormProps) {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  return (
    <>
      <h2>Edit User {username}</h2>
      <Formik
        initialValues={editModel}
        validationSchema={
          Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Required'),
          })
        }
        onSubmit={(values, actions) => {
          submitFormikJson<EditUserModel, EditUserValidationFailures>(`user/${userId}`, values, actions, 'PUT')
            .then(parsedResponse => {
              setHasBeenSaved(parsedResponse.isSuccess);
            });
        }}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit} method="POST">
            <LocalTextInput label="Email" name="email" type="email" />
            <LocalTextInput label="Phone Number" name="phoneNumber" type="tel" />

            <button type="submit" disabled={formik.isSubmitting}>Save</button>
            {hasBeenSaved && !formik.dirty && (<div className='saved-notification'>Saved</div>)}
          </Form>
        )}
      </Formik>
    </>
  );
}
