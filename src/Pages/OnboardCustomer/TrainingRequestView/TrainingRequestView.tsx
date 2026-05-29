import { TrainingRequest } from '../../../dtoModels';
import { CaretakerType } from '../../../enums';
import { formatPhoneNumber, unixSecondsToString } from '../../../fieldTransformers';
import './TrainingRequestView.css';

interface TrainingRequestViewProps {
  record: TrainingRequest
}

export default function TrainingRequestView({ record } : TrainingRequestViewProps) {
  const isOnboarded = record !== null && record.squirrelId !== null;
  return (
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
          <td>{record.caretakerType === CaretakerType.Person ? 'individual' : 'organization'}</td>
        </tr>
        <tr>
          <td>Caretaker Name</td>
          <td>{record.caretakerType === CaretakerType.Person ? record.ownerLastName + ', ' + record.ownerFirstName : record.organizationName}</td>
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
  )
}