import { Form, Formik } from 'formik';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import { submitFormikJson } from '../../../Forms/Submission/formikSubmission';

interface RoleFormProps {
  roleList: { [key: string]: boolean };
  userId: string | undefined;
}

export default function RoleForm({ roleList, userId }: RoleFormProps) {
  if (Object.keys(roleList).length === 0) return <></>;

  return (
    <Formik
      initialValues={roleList}
      enableReinitialize
      onSubmit={(values, actions) => {
        submitFormikJson<{ [key: string]: boolean }, {}>(`user/${userId}/roles`, values, actions, 'PUT')
          .then(() => actions.setSubmitting(false));
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
