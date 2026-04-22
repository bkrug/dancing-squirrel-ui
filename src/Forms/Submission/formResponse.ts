export default class FormResponse<T extends object> {
  isSuccess: boolean = false;
  isInternalError: boolean = false;
  validationFailures: any = {};
  public get validationFailuresStrict(): T {
    return this.validationFailures as T;
  }
}

export class PagedData<T extends object> {
  page: number = 0;
  totalRecords: number = 0;
  data: T[] = [];
}