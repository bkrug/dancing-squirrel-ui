import { Effect } from 'effect';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import { EditClaimsModel, Teacher, ViewUserModel } from '../../../dtoModels';
import FeedbackSubmit from '../../../Forms/FeedbackSubmit';
import { LocalSelectList, SelectListOption } from '../../../Forms/Fields/LocalFields';
import { getParsedResponse, submitFormikJson } from '../../../Forms/Submission/formikSubmission';

interface EditClaimsValidationFailures {}

interface ClaimsFormProps {
  viewModel: ViewUserModel;
}

export default function ClaimsForm({ viewModel }: ClaimsFormProps) {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([] as SelectListOption[]);
  const initialValues: EditClaimsModel = {
    teacherId: viewModel.teacherId
  };

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
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        const url = `user/${viewModel.userId}/claims`;
        submitFormikJson<EditClaimsModel, EditClaimsValidationFailures>(url, values, actions, 'PUT')
          .then(parsedResponse => setHasBeenSaved(parsedResponse.isSuccess));
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} method="POST">
          {isLoadingTeachers
            ? <LoadingSpinner />
            : <LocalSelectList label="Teacher" name="teacherId" options={teacherOptions}/>
          }

          <FeedbackSubmit label="Save User Claims" formikState={formik} displayCompletion={hasBeenSaved} />
        </Form>
      )}
    </Formik>
  );
}
