import { Effect } from 'effect/index';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { CreateEditDefaultAvailability, CreateEditDefaultDayAvailability, ViewDefaultAvailability } from '../../dtoModels';
import FeedbackSubmit from '../../Forms/FeedbackSubmit';
import { LocalSelectList, LocalTextInput } from '../../Forms/Fields/LocalFields';
import { getParsedResponse, submitFormikJson } from '../../Forms/Submission/formikSubmission';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class DefaultAvailabilityValidationFailures {
  availabilities: string = '';
}

export default function DefaultAvailability() {
  const { teacherId } = useAuth();
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [initialValues, setInitialValues] = useState(new CreateEditDefaultAvailability());

  useEffect(() => {
    getParsedResponse(`teacher/${teacherId}/availability`, ViewDefaultAvailability, 'GET')
      .then(result => {
        Effect.runPromise(Effect.match(result, {
          onSuccess: viewDefaultResponse => setInitialValues(Object.assign(new CreateEditDefaultAvailability(), {
            availabilities: viewDefaultResponse.availabilities.map(
              availability => Object.assign(new CreateEditDefaultDayAvailability(), availability)
            )
          })),
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
          submitFormikJson<CreateEditDefaultAvailability, DefaultAvailabilityValidationFailures>(
            `teacher/${teacherId}/availability`, values, actions, 'PUT'
          )
            .then(parsedResponse => {
              setHasBeenSaved(parsedResponse.isSuccess);
            });
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
