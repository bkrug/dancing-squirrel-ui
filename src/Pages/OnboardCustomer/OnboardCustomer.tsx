import { useParams } from 'react-router';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { getJsonWithConstructor } from '../../Forms/Submission/formikSubmission';
import { useEffect, useState } from 'react';

export default function OnboardCustomer() {
  let { trainingRequestId } = useParams();
  let [ record, setRecord ] = useState(null as (TrainingRequest | null));

  useEffect(
    () => {
      getJsonWithConstructor(`requests?trainingRequestId=${trainingRequestId}`, TrainingRequest)
        .then(json => {
          let trainingRequest = json as TrainingRequest;
          console.log(json);
          console.log(trainingRequest);
          setRecord(trainingRequest);
        });
    },
    []
  );

  return (
    <>
      <h1>{trainingRequestId}</h1>
      SqurrielName: { record === null ? '' : record.squirrelName }
    </>
  );
}