import { Effect } from 'effect/index';
import { Form, Formik } from 'formik';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { LocalTextInput } from '../../Forms/Fields/LocalFields';
import { getPagedData, getParsedResponse, submitFormikJson } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import './EditUser.css';

export class EditUserValidationFailures {
  email: string = '';
  phoneNumber: string = '';
}

export default function EditUser() {
  let { userId } = useParams();
  let [ viewModel, setViewModel ] = useState(null as null | ViewUserModel);
  let [ editModel, setEditModel ] = useState(null as null | EditUserModel);
  let [ roleList, setRoleList ] = useState({} as { [key:string] : boolean });
  let [ hasBeenSaved, setHasBeenSaved ] = useState(false);

  //TODO: Maybe all of this data should just come from a single request
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
  }, [userId]);
  useEffect(() => {
    getPagedData<String>('role')
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: (parsedResponse) => {
            const userRoleNames = viewModel?.roles.map(r => r.name) ?? [];
            setRoleList(Object.fromEntries(
              parsedResponse.data
                .map(role => role.toString())
                .map(role => [role, userRoleNames.includes(role)])
            ));
          },
          onFailure: (failureResponse) => console.log(failureResponse)
        }))
      )
  }, [viewModel === null])

  let contactFieldForm = (
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
                  console.log(parsedResponse.isSuccess);
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
      : <></>
  );

  let roleForm = (
    Object.keys(roleList).length > 0
    ? <Formik
        initialValues={roleList}
        enableReinitialize
        onSubmit={(values, actions) => {
          submitFormikJson<{ [key: string]: boolean }, {}>(`user/${userId}/roles`, values, actions, 'PUT')
            .then(() => actions.setSubmitting(false));
        }}>
        {formik => (
          <Form onSubmit={formik.handleSubmit}>
            {Object.keys(formik.values).map(role => (
              <div key={role}>
                <label>{role}</label>
                <Switch
                  checked={formik.values[role]}
                  onChange={(checked: boolean) => formik.setFieldValue(role, checked)}
                />
              </div>
            ))}
            <button type="submit" disabled={formik.isSubmitting}>Save Roles</button>
          </Form>
        )}
      </Formik>
    : <></>);

  return (
    <div className='form-parent'>
      {contactFieldForm}
      {roleForm}
      <div>
        Roles: {viewModel?.roles.map(r => r.name).join(', ')}
      </div>
    </div>
  )
}
