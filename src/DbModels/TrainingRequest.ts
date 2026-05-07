import { CaretakerType } from '../Enums';

export default class TrainingRequest
  {
    trainingRequestId: number = 0;
    squirrelName: string = '';
    caretakerType: CaretakerType = CaretakerType.Empty;
    organizationName: string | null = null;
    ownerLastName: string | null = null;
    ownerFirstName: string | null = null;
    email: string = '';
    phone: string | null = null;
    squirrelId: number | null = null;
    onboardUsername: string | null = null;
    onboardingDateTimeUnix: number | null = null;
    descriptionOfNeeds: string | null = null;
  }

export function unixSecondsToString(unixSeconds: number | null) {
  return unixSeconds === null ? '' : new Date(unixSeconds*1000).toISOString();
}