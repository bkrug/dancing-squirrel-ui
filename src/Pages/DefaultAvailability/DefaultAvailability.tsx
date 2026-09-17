import { Effect } from 'effect/index';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { CreateEditDefaultAvailability, CreateEditDefaultDayAvailability, DefaultAvailabilityValidation } from '../../dtoModels';
import FeedbackSubmit from '../../Forms/FeedbackSubmit';
import { LocalSelectList, LocalTextInput, ModelFailureMsg } from '../../Forms/Fields/LocalFields';
import { getParsedResponse, submitFormWithResult } from '../../Forms/Submission/formikSubmission';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DefaultAvailability() {
  const { teacherId } = useAuth();
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [initialValues, setInitialValues] = useState(new CreateEditDefaultAvailability());

  useEffect(() => {
    getParsedResponse(`teacher/${teacherId}/availability`, CreateEditDefaultAvailability, 'GET')
      .then(result => {
        Effect.runPromise(Effect.match(result, {
          onSuccess: viewDefaultResponse => setInitialValues(viewDefaultResponse),
          onFailure: failureResponse => alert(JSON.stringify(failureResponse))
        }));
      });
  }, [teacherId]);

  const dayOfWeekOptions = daysOfWeek.map(day => ({ value: day, label: day }));

  return (
    <>
      <h1>Default Availability</h1>
      <div>Specify which hours you are normally free to teach lessons in a week.</div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          submitFormWithResult<CreateEditDefaultAvailability, DefaultAvailabilityValidation>(
            `teacher/${teacherId}/availability`, values, actions,
            CreateEditDefaultAvailability, 'PUT'
          )
          .then(result => Effect.runPromise(Effect.match(result, {
            onSuccess: formResponse => {
              setHasBeenSaved(true);
              setInitialValues(formResponse);
            },
            onFailure: () => setHasBeenSaved(false)
          })));
        }}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit}>
            <FieldArray name="availabilities">
              {({ push, remove }) => (
                <>
                  {formik.values.availabilities.map((_, index) => (
                    <div key={index} className="form-row">
                      <LocalSelectList label="Day" name={`availabilities[${index}].dayOfWeek`} options={dayOfWeekOptions} />
                      <LocalTextInput label="Start Time" name={`availabilities[${index}].startTime`} />
                      <LocalTextInput label="End Time" name={`availabilities[${index}].endTime`} />
                      <ModelFailureMsg name={`availabilities[${index}].modelFailure`} />

                      <button type="button" onClick={() => remove(index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => push(new CreateEditDefaultDayAvailability())}>Add Row</button>
                </>
              )}
            </FieldArray>

            <FeedbackSubmit label="Save Availability" formikState={formik} displayCompletion={hasBeenSaved} />
          </Form>
        )}
      </Formik>
    </>
  );
}
