import { useParams } from 'react-router';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { getJsonWithConstructor } from '../../Forms/Submission/formikSubmission';
import { useEffect, useState } from 'react';

export default function OnboardCustomer() {
  let { trainingRequestId } = useParams();
  let [ record, setRecord ] = useState(null as (TrainingRequest | null));

  useEffect(
    () => {
      getJsonWithConstructor(`requests/${trainingRequestId}`, TrainingRequest)
        .then(json => setRecord(json as TrainingRequest))
    },
    [ trainingRequestId ]
  );

  return (
    <>
      <h1>{trainingRequestId}</h1>
      SqurrielName: { record === null ? '' : record.squirrelName }
    </>
  );
}