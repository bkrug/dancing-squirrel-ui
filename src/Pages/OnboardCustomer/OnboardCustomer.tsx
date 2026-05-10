import { useParams } from 'react-router';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { unixSecondsToString, formatPhoneNumber } from '../../fieldTransformers';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { useEffect, useState } from 'react';
import { Effect } from 'effect';
import './OnboardCustomer.css';

export default function OnboardCustomer() {
  let { trainingRequestId } = useParams();
  let [ record, setRecord ] = useState(null as (TrainingRequest | null));
  let [ failureMsg, setFailureMsg ] = useState('');

  const loadTrainingRequest = (url: string, verb: 'GET' | 'POST') => {
    getParsedResponse(url, TrainingRequest, verb)
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: trainingRequest => setRecord(trainingRequest),
          onFailure: failureResponse => setFailureMsg(failureResponse.validationFailures || '')
        }))
      );
  }

  useEffect(() => loadTrainingRequest(`trainingRequest/${trainingRequestId}`, 'GET'), [trainingRequestId]);

  const onboardFromTrainingRequest = () => loadTrainingRequest(`squirrel/trainingRequest/${trainingRequestId}`, 'POST');

  const isOnboarded = record !== null && record.squirrelId !== null;

  const failureMsgDisplay = (
    <span>{failureMsg}</span>
  )
  const recordDisplay = record === null
    ? (<></>)
    : (
      <>
        <table>
          <tbody>
            <tr>
              <td>Is Onboarded?</td>
              <td>{isOnboarded ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Squrriel Name</td>
              <td>{record.squirrelName}</td>
            </tr>
            <tr>
              <td>Caretaker Type</td>
              <td>{record.organizationName === null ? 'individual' : 'organization'}</td>
            </tr>
            <tr>
              <td>Caretaker Name</td>
              <td>{record.organizationName === null ? record.ownerLastName + ', ' + record.ownerFirstName : record.organizationName}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{record.email}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{formatPhoneNumber(record.phone)}</td>
            </tr>
            <tr>
              <td>Description of Needs</td>
              <td>{record.descriptionOfNeeds}</td>
            </tr>
            {
              isOnboarded
              ? <>
                <tr>
                  <td>Employee who did Onboarding</td>
                  <td>{record.onboardUsername}</td>
                </tr>
                <tr>
                  <td>Date of Onboarding</td>
                  <td>{unixSecondsToString(record.onboardingDateTimeUnix)}</td>
                </tr>
              </>
              : <></>
            }
          </tbody>
        </table>
        <button onClick={onboardFromTrainingRequest}>Onboard Squirrel and Caretaker</button>
      </>
    );

  return (
    <>
      {failureMsgDisplay}
      {recordDisplay}
    </>
  )
}