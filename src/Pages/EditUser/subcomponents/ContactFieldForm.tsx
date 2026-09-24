import { Effect } from 'effect';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import { EditUserModel, Teacher, ViewUserModel } from '../../../dtoModels';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalSelectList, LocalTextInput, SelectListOption } from '../../../Forms/Fields/LocalFields';
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
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([] as SelectListOption[]);

  useEffect(() => {
    setIsLoadingTeachers(true);
    getParsedResponse('teacher', Array<Teacher>)
      .then(result => Effect.runPromise(Effect.match(result, {
        onSuccess: parsed => setTeacherOptions(
          parsed.map(teacher => ({ value: teacher.teacherId, label: `${teacher.firstName} ${teacher.lastName}` }))
        ),
        onFailure: err => console.error(err)
      })))
      .finally(() => setIsLoadingTeachers(false));
  }, []);

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
          .then(parsedResponse => setHasBeenSaved(parsedResponse.isSuccess));
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          <LocalTextInput label="Email" name="email" type="email" />
          <LocalTextInput label="Phone Number" name="phoneNumber" type="tel" />

          {isLoadingTeachers
            ? <LoadingSpinner />
            : <LocalSelectList label="Teacher" name="teacherId" options={teacherOptions}/>
          }

          <FeedbackSubmit label="Save Contact Info" formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
