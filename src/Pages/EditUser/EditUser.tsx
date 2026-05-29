import { Effect } from 'effect/index';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { LocalTextInput } from '../../Forms/Fields/LocalFields';
import { getParsedResponse, submitFormikJson } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import './EditUser.css';

export class EditUserValidationFailures {
  email: string = '';
  phoneNumber: string = '';
}

export default function EditUser() {
  let { userId } = useParams();
  console.log('userId', userId);
  let [ viewModel, setViewModel ] = useState(null as null | ViewUserModel);
  let [ editModel, setEditModel ] = useState(null as null | EditUserModel);

  useEffect(() => {
    getParsedResponse(`user/${userId}`, ViewUserModel)
      .then(parsedResponse => {
        Effect.runPromise(Effect.match(parsedResponse, {
          onSuccess: parsed => {
            setViewModel(parsed)
            setEditModel({ email: parsed.email, phoneNumber: parsed.phoneNumber });
          },
          onFailure: err => console.error(err)
        }))
      })
  }, [userId])

  return (
    editModel
      ? <>
          <h2>Edit User {viewModel?.username}</h2>
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
                  if (parsedResponse.isSuccess) {

                  }
                });
            }}
          >
            {formik => (
              <Form onSubmit={formik.handleSubmit} method="POST">
                <LocalTextInput label="Email" name="email" type="email" />
                <LocalTextInput label="Phone Number" name="phoneNumber" type="tel" />

                <button type="submit">Save</button>
              </Form>
            )}
          </Formik>
        </>
      : <></>
  );
}
