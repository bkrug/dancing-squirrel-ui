import { Effect } from 'effect';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import { EditUserModel, Teacher, ViewUserModel } from '../../../dtoModels';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalSelectList, LocalTextInput } from '../../../Forms/Fields/LocalFields';
import { getParsedResponse, submitFormikJson } from '../../../Forms/Submission/formikSubmission';

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
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(viewModel.teacherId != null);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [teachers, setTeachers] = useState([] as Teacher[]);

  useEffect(() => {
    if (!isAssigningTeacher) return;

    setIsLoadingTeachers(true);
    getParsedResponse('teacher', Array<Teacher>)
      .then(result => Effect.runPromise(Effect.match(result, {
        onSuccess: parsed => setTeachers(parsed as Teacher[]),
        onFailure: err => console.error(err)
      })))
      .finally(() => setIsLoadingTeachers(false));
  }, [isAssigningTeacher]);

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
        <Form onSubmit={formik.handleSubmit} method="POST">
          <LocalTextInput label="Email" name="email" type="email" />
          <LocalTextInput label="Phone Number" name="phoneNumber" type="tel" />

          <div className="field-container">
            <label className="label-on-left" htmlFor="isAssigningTeacher">Assign Teacher</label>
            <div className="right-of-label">
              <input
                type="checkbox"
                id="isAssigningTeacher"
                checked={isAssigningTeacher}
                onChange={e => setIsAssigningTeacher(e.target.checked)}
              />
            </div>
          </div>

          <div hidden={!isAssigningTeacher}>
            {isLoadingTeachers
              ? <LoadingSpinner />
              : (
                <LocalSelectList
                  label="Teacher"
                  name="teacherId"
                  options={teachers.map(teacher => ({
                    value: teacher.teacherId,
                    label: `${teacher.firstName} ${teacher.lastName}`
                  }))}
                />
              )}
          </div>

          <FeedbackSubmit label="Save Contact Info" formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
