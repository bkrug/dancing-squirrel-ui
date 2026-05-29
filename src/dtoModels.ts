import { CaretakerType } from './enums';

export class TrainingRequest
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

export class DanceType
{
  danceTypeId: number = 0;
  name: string = ''
}

export class Teacher
{
  teacherId: number = 0;
  firstName: string = '';
  lastName: string = '';
}

export class GridUser
{
  userId: string = '';
  username: string = '';
  email: string = '';
}

export class EditUserModel
{
  email: string = '';
  phoneNumber: string = '';
}