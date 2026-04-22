import { useParams } from 'react-router';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { getJsonWithConstructor } from '../../Forms/Submission/formikSubmission';
import { useEffect, useState } from 'react';
import './OnboardCustomer.css';

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

  const isOnboarded = record !== null && record.squirrelId !== null;

  return (
    <>
      <h1>{trainingRequestId}</h1>
      { record === null
        ? <></>
        : (<table>
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
              <td>{record.phone}</td>
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
                  <td>{record.onboardingDateTime}</td>
                </tr>          
              </>
              : <></>
            }
          </tbody>
        </table>)
      }
    </>
  );
}