import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalTextInput } from '../../../Forms/Fields/LocalFields';
import { submitFormikJson } from '../../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../../dtoModels';

class EditUserValidationFailures {
  email: string = '';
  phoneNumber: string = '';
}

interface ContactFieldFormProps {
  editingOwnData: boolean;   //Admins can edit any user's data. Non-admins can edit their own data.
  editModel: EditUserModel;
  viewModel: ViewUserModel;
}

export default function ContactFieldForm({ editingOwnData, editModel, viewModel }: ContactFieldFormProps) {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  return (
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
        const url = editingOwnData
          ? 'user/self'
          : `user/${viewModel.userId}`
        submitFormikJson<EditUserModel, EditUserValidationFailures>(url, values, actions, 'PUT')
          .then(parsedResponse => {
            setHasBeenSaved(parsedResponse.isSuccess);
          });
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method='POST'>
          <LocalTextInput label='Email' name='email' type='email' />
          <LocalTextInput label='Phone Number' name='phoneNumber' type='tel' />

          <FeedbackSubmit label='Save Contact Info' formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
