import { Effect } from 'effect';
import { FormikHelpers } from 'formik';
import { FormResponse, GenericModelResponse, PagedData } from '../Submission/formResponse';
import parseToCamelCase from '../Submission/jsonParsing';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError('Base URL is not configured');

function getFormData(source: any) : FormData {
  var formData = new FormData();
  let key: keyof any;
  for (key in source) {
    let foundValue = source[key];
    formData.append(key, foundValue.toString());
  }
  return formData;
};

export async function submitUserCredentials<TValues extends object, TValidationFailures extends object>
  (
    endpoint: string,
    values: TValues,
    actions: FormikHelpers<TValues>
  )
  : Promise<FormResponse<TValidationFailures>>
{
  const fullUrl = new URL(endpoint, baseUrl)
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(values)
    });
    console.log(response);
    //actions.resetForm();
    actions.setSubmitting(false);
    return {
      isSuccess: response.ok,
      isInternalError: false,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  } catch (httpErrors) {
    console.error(httpErrors);
    alert('An HTTP error occurred.');
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  }
};

export async function submitFormikForm<TValues extends object, TValidationFailures extends object>
  (
    endpoint: string,
    values: TValues,
    actions: FormikHelpers<TValues>,
    methodVerb?: 'POST' | 'PUT'
  )
  : Promise<FormResponse<TValidationFailures>>
{
  let formData = getFormData(values);
  let fullUrl = new URL(endpoint, baseUrl)

  try {
    const response = await fetch(fullUrl, {
      method: methodVerb || 'POST',
      mode: 'cors',
      credentials: 'include',
      body: formData
    });
    const jsonString = await response.text();
    let parsedResponse = parseToCamelCase((FormResponse<TValidationFailures>), jsonString);
    if (parsedResponse.isSuccess) {
      actions.resetForm();
    }
    else if (parsedResponse.validationFailuresStrict) {
      actions.setErrors(parsedResponse.validationFailuresStrict);
    }
    else if (parsedResponse.isInternalError) {
      alert('An internal error occurred.');
    }
    else {
      alert('A malformed response was received from the server.');
    }
    actions.setSubmitting(false);
    return parsedResponse;
  } catch (httpErrors) {
    console.error(httpErrors);
    alert('An HTTP error occurred.');
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  }
};

export async function submitFormikJson<TValues extends object, TValidationFailures extends object>
  (
    endpoint: string,
    values: TValues,
    actions: FormikHelpers<TValues>,
    methodVerb?: 'POST' | 'PUT'
  )
  : Promise<FormResponse<TValidationFailures>>
{
  let fullUrl = new URL(endpoint, baseUrl)

  try {
    const response = await fetch(fullUrl, {
      method: methodVerb || 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(values)
    });
    const jsonString = await response.text();
    let parsedResponse = parseToCamelCase((FormResponse<TValidationFailures>), jsonString);
    if (parsedResponse.isSuccess) {
      actions.resetForm();
    }
    else if (parsedResponse.validationFailuresStrict) {
      actions.setErrors(parsedResponse.validationFailuresStrict);
    }
    else if (parsedResponse.isInternalError) {
      alert('An internal error occurred.');
    }
    else {
      alert('A malformed response was received from the server.');
    }
    actions.setSubmitting(false);
    return parsedResponse;
  } catch (httpErrors) {
    console.error(httpErrors);
    alert('An HTTP error occurred.');
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  }
};

export async function getPagedData<TParsed extends object>(endpoint: string )
{
  return await getParsedResponse(endpoint, PagedData<TParsed>);
};

export async function getParsedResponse<TParsed extends object>(endpoint: string, constructor: { new (): TParsed}, methodVerb?: string, body?: object)
{
  const fullUrl = new URL(endpoint, baseUrl)
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(fullUrl, {
      method: methodVerb || 'GET',
      headers: headers,
      mode: 'cors',
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    const jsonString = await response.text();
    if (response.ok) {
      let parsedResponse = parseToCamelCase(constructor, jsonString);
      return !parsedResponse
        ? Effect.fail(getInternalError('A malformed response was received from the server.')) as Effect.Effect<TParsed, GenericModelResponse<string>, never>
        : Effect.succeed(parsedResponse) as Effect.Effect<TParsed, GenericModelResponse<string>, never>;
    }
    else {
      return Effect.fail(parseToCamelCase(GenericModelResponse<string>, jsonString)) as Effect.Effect<TParsed, GenericModelResponse<string>, never>;
    }
  } catch (httpErrors) {
    console.error(httpErrors);
    return Effect.fail(getInternalError('An Http Request Failed')) as Effect.Effect<TParsed, GenericModelResponse<string>, never>;
  }
};

function getInternalError(failureMsg: string) {
  return {
    isSuccess: false,
    isInternalError: true,
    validationFailures: failureMsg
  } as GenericModelResponse<string>;
}
