import { Effect } from 'effect';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { TrainingRequest } from '../../DbModels';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import PotentialTeachers from './PotentialTeachers/PotentialTeachers';
import TrainingRequestView from './TrainingRequestView/TrainingRequestView';

class OnboardingRequest
{
  danceTeachers: number[] = [];
}

export default function OnboardCustomer() {
  let { trainingRequestId } = useParams();
  let [ record, setRecord ] = useState(null as (TrainingRequest | null));
  let [ failureMsg, setFailureMsg ] = useState('');
  let [ checkedTeacherIds, setCheckedTeacherIds ] = useState(new Set<number>());

  const loadTrainingRequest = (url: string, verb: 'GET' | 'POST', body?: object) => {
    getParsedResponse(url, TrainingRequest, verb, body)
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: trainingRequest => setRecord(trainingRequest),
          onFailure: failureResponse => setFailureMsg(failureResponse.validationFailures || '')
        }))
      );
  }

  useEffect(() => loadTrainingRequest(`trainingRequest/${trainingRequestId}`, 'GET'), [trainingRequestId]);

  const onboardFromTrainingRequest = () => {
    const requestBody = new OnboardingRequest();
    requestBody.danceTeachers = Array.from(checkedTeacherIds);
    loadTrainingRequest(`squirrel/trainingRequest/${trainingRequestId}`, 'POST', requestBody);
  };

  const recordDisplay = record === null
    ? (<></>)
    : (
      <>
        <TrainingRequestView record={record} />
        <PotentialTeachers onCheckedTeachersChange={setCheckedTeacherIds} />
        <button onClick={onboardFromTrainingRequest}>Onboard Squirrel and Caretaker</button>
      </>
    );

  return (
    <>
      <span>{failureMsg}</span>
      {recordDisplay}
    </>
  )
}