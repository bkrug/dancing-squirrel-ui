export default class FormResponse<T extends object> {
  isSuccess: boolean = false;
  isInternalError: boolean = false;
  validationFailures: any = {};
  public get validationFailuresStrict(): T {
    return this.validationFailures as T;
  }
}