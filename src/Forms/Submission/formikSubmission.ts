import { FormikHelpers } from 'formik';
import parseToCamelCase from "../Submission/jsonParsing";
import FormResponse from '../Submission/formResponse';

const baseUrl = process.env.REACT_APP_BACKEND_API;
if (!baseUrl) throw new TypeError("Base URL is not configured");

export function getFormData(source: any) : FormData {
  var formData = new FormData();
  let key: keyof any;
  for (key in source) {
    let foundValue = source[key];
    formData.append(key, foundValue.toString());
  }
  return formData;
}

export function submitUserCredentials<TValues extends object, TValidationFailures extends object>
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

  return fetch(fullUrl, {
    method: "POST",
    headers: headers,
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(values)
  })
  .then(response => {
    console.log(response);
    //actions.resetForm();
    actions.setSubmitting(false);
    return {
      isSuccess: response.ok,
      isInternalError: false,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  })
  .catch(httpErrors => {
    console.error(httpErrors);
    alert("An HTTP error occurred.");
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  });
}

//TODO: remove duplicate code
export function submitFormikJson<TValues extends object, TValidationFailures extends object>
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

  return fetch(fullUrl, {
    method: "POST",
    headers: headers,
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(values)
  })
  .then(response => response.text())
  .then(jsonString => {
    let parsedResponse = parseToCamelCase(FormResponse<TValidationFailures>, jsonString);
    if (parsedResponse.isSuccess) {
      actions.resetForm();
    }
    else if (parsedResponse.validationFailuresStrict) {
      actions.setErrors(parsedResponse.validationFailuresStrict);
    }
    else if (parsedResponse.isInternalError) {
      alert("An internal error occurred.");
    }
    else {
      alert("A malformed response was received from the server.");
    }
    actions.setSubmitting(false);
    return parsedResponse;
  })
  .catch(httpErrors => {
    console.error(httpErrors);
    alert("An HTTP error occurred.");
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  });
}

export default function submitFormikForm<TValues extends object, TValidationFailures extends object>
  (
    endpoint: string,
    values: TValues,
    actions: FormikHelpers<TValues>
  )
  : Promise<FormResponse<TValidationFailures>>
{
  let formData = getFormData(values);
  let fullUrl = new URL(endpoint, baseUrl)

  return fetch(fullUrl, {
    method: "POST",
    mode: "cors",
    credentials: "include", 
    body: formData
  })
  .then(response => response.text())
  .then(jsonString => {
    let parsedResponse = parseToCamelCase(FormResponse<TValidationFailures>, jsonString);
    if (parsedResponse.isSuccess) {
      actions.resetForm();
    }
    else if (parsedResponse.validationFailuresStrict) {
      actions.setErrors(parsedResponse.validationFailuresStrict);
    }
    else if (parsedResponse.isInternalError) {
      alert("An internal error occurred.");
    }
    else {
      alert("A malformed response was received from the server.");
    }
    actions.setSubmitting(false);
    return parsedResponse;
  })
  .catch(httpErrors => {
    console.error(httpErrors);
    alert("An HTTP error occurred.");
    actions.setSubmitting(false);
    return {
      isSuccess: false,
      isInternalError: true,
      validationFailures: {}
    } as FormResponse<TValidationFailures>;
  });
}
