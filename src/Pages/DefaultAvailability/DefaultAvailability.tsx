import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { ViewDefaultAvailability, ViewDefaultDayAvailability } from '../../dtoModels';

export default function DefaultAvailability() {
  const { teacherId } = useAuth();
  const [ availabilities, setAvailabilities ] = useState([] as ViewDefaultDayAvailability[]);

  useEffect(() => {
    getParsedResponse(`teacher/${teacherId}/availability`, ViewDefaultAvailability, 'GET')
      .then(result => {
        Effect.runPromise(Effect.match(result, {
          onSuccess: viewDefaultResponse => setAvailabilities(viewDefaultResponse.availabilities),
          onFailure: failureResponse => alert(JSON.stringify(failureResponse))
        }));
      });
  }, [teacherId]);

  return (
    <>
      <h1>Default Availability</h1>
      <span>Spefiy which hours you are normally free to teach lessons in a week.</span>
    </>
  )
}