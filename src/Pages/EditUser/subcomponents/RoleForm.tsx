import { Effect } from 'effect/index';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { ViewRoleModel } from '../../../dtoModels';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalSwitch } from '../../../Forms/Fields/LocalFields';
import { getParsedResponse } from '../../../Forms/Submission/formikSubmission';
import './RoleForm.css';

interface RoleFormProps {
  roleList: { [key: string]: boolean };
  userId: string | undefined;
}

interface RoleEditingForm {
  roles: ViewRoleModel[]
}

export default function RoleForm({ roleList, userId }: RoleFormProps) {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  return (
    <>
      <Formik
        initialValues={roleList}
        enableReinitialize
        onSubmit={(values, actions) => {
          var form = {
            roles: Object.keys(values)
              .filter(key => values[key])
              .map(key => Object.assign(new ViewRoleModel(), { name: key }))
          } as RoleEditingForm;
          getParsedResponse(`user/${userId}/role`, Object, 'PUT', form)
            .then(result => {
              actions.setSubmitting(false);
              Effect.runPromise(Effect.match(result, {
                onSuccess: _ => setHasBeenSaved(true),
                onFailure: failureResponse => {
                  alert(JSON.stringify(failureResponse));
                  setHasBeenSaved(false);
                }
              }));
            });
        }}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit} className="roleform">
            {Object.keys(formik.values).map(roleName => (
              <LocalSwitch key={roleName} label={roleName} name={roleName} />
            ))}
            <FeedbackSubmit label="Save Roles" formikState={formik} displayCompletion={hasBeenSaved} />
          </Form>
        )}
      </Formik>
    </>
  );
}
