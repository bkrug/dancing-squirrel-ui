import { Effect } from 'effect/index';
import { Form, Formik } from 'formik';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import { getParsedResponse } from '../../../Forms/Submission/formikSubmission';
import { ViewRoleModel } from '../../../dtoModels';

interface RoleFormProps {
  roleList: { [key: string]: boolean };
  userId: string | undefined;
}

interface RoleEditingForm {
  roles: ViewRoleModel[]
}

export default function RoleForm({ roleList, userId }: RoleFormProps) {
  return (
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
              onSuccess: _ => {},
              onFailure: failureResponse => alert(JSON.stringify(failureResponse))
            }));
          });
      }}
    >
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
  );
}
