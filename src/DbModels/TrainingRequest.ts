export default class TrainingRequest
  {
    trainingRequestId: number = 0;
    squirrelName: string = '';
    organizationName: string | null = null;
    ownerLastName: string | null = null;
    ownerFirstName: string | null = null;
    email: string = '';
    phone: string | null = null;
    squirrelId: number | null = null;
    onboardUsername: string | null = null;
    onboardingDateTime: string | null = null;
    descriptionOfNeeds: string | null = null;
  }