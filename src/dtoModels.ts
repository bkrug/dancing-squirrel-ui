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


export class EditUserValidation
{
  email: string = '';
  phoneNumber: string = '';
  teacherId: string = '';
}

export class EditUserModel
{
  email: string = '';
  phoneNumber: string = '';
  teacherId: number | null = null;
}

export class ViewRoleModel
{
  name: string = '';
}

export class CreateUserModel
{
  email: string = '';
  username: string = '';
  password: string = '';
  phoneNumber: string = '';
}

export class ViewUserModel
{
  userId: string = '';
  username: string = '';
  email: string = '';
  phoneNumber: string = '';
  roles: ViewRoleModel[] = [];
  teacherId: number | null = null;
}

export class EditRoleModel {
  roles: ViewRoleModel[] = [];
}

export class EditClaimsModel {
  teacherId: number | null = null;
}

export class OwnPasswordResetModel {
  oldPassword: string = '';
  newPassword: string = '';
}

export class PasswordResetModel {
  newPassword: string = '';
}

export class Claim {
  type: string = '';
  value: string = '';
}

export class ClaimResponse {
  claims: Claim[] = [];
}

export class CreateEditDefaultDayAvailability {
  defaultAvailabilityId: number | null = null;
  dayOfWeek: string | null = '';
  startTime: string | null = '';
  endTime: string | null = '';
}

export class CreateEditDefaultAvailability {
  availabilities: CreateEditDefaultDayAvailability[] = [];
}

export class DefaultDayAvailabilityValidation {
  modelFailure: string = '';
  dayOfWeek: string = '';
  startTime: string = '';
  endTime: string = '';
}

export class DefaultAvailabilityValidation {
  modelFailure: string = '';
  availabilities: DefaultDayAvailabilityValidation[] = [];
}