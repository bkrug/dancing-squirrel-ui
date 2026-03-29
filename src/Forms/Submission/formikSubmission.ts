import { FormikHelpers } from 'formik';
import parseToCamelCase from "../Submission/jsonParsing";
import FormResponse from '../Submission/formResponse';

export function getFormData(source: any) : FormData {
  var formData = new FormData();
  let key: keyof any;
  for (key in source) {
    let foundValue = source[key];
    formData.append(key, foundValue.toString());
  }
  return formData;
}

export default function submitFormikForm<TValues extends object, TValidationFailures extends object>
  (
    url: string,
    values: TValues,
    actions: FormikHelpers<TValues>
  )
{
  let formData = getFormData(values);

  fetch(url, {
    method: "POST",
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
  })
  .catch(httpErrors => {
    console.error(httpErrors);
    alert("An HTTP error occurred.");
    actions.setSubmitting(false);
  });
}
