import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { CaretakerType } from '../../enums';
import submitFormikForm from '../../Forms/Submission/formikSubmission';
import FormResponse, { GenericModelResponse } from '../../Forms/Submission/formResponse';
import { getInputOrTextArea } from '../../testHelpers';
import CustomerSignup from './CustomerSignup';
import { TrainingRequestValidationFailures } from './TrainingRequest/TrainingRequestForm';

// jest.mock('../../Forms/Submission/formikSubmission', () => ({
//   submitFormikForm: jest.fn()
// }));
jest.mock('../../Forms/Submission/formikSubmission', () => jest.fn());

jest.mock('react-router', () => ({
  useParams: jest.fn()
}));

const typeOrFail = function(labelText: RegExp | string, textToType: string) {
  const inputOrTextArea = getInputOrTextArea(labelText);
  if (inputOrTextArea === null)
    fail(`Could not find an input with label ${labelText}`);
  else
    fireEvent.change(inputOrTextArea, {target:{value:textToType}});  
}

test('User submitted a form and the backend reported success. Expect the form to become invisible and a success message to be displayed instead.', async () => {
  //Arrange: When user clicks the form's submit button, report that the form was submitted successfully.
  const responseFromHttpGetRequest = Promise.resolve({ isSuccess: true } as FormResponse<TrainingRequestValidationFailures>);
  (submitFormikForm as jest.Mock).mockReturnValue(responseFromHttpGetRequest);  

  //Act: render form
  await act(async () => render(<CustomerSignup />));

  //Assert that the form is visible
  expect(screen.queryByText('Phone')).toBeInTheDocument();
  expect(screen.queryByText('Email')).toBeInTheDocument();
  expect(screen.queryByText('Squirrel Name')).toBeInTheDocument();

  //Act: fill in form and submit
  await act(async () => {
    typeOrFail('First Name', 'John');
    typeOrFail('Last Name', 'Smith');
    typeOrFail('Email', 'johnsmith@example.com');
    typeOrFail('Phone', '1-212-555-1234');
    typeOrFail('Squirrel Name', 'Fluffy')
    typeOrFail(/Describe the training/i, 'Squirrel must learn to dance');
    
    const submitButton = screen.getByText('Register Squirrel');
    fireEvent.submit(submitButton);
  });

  //Assert the the form is replaced by a success message
  expect(screen.queryByText('Phone')).not.toBeInTheDocument();
  expect(screen.queryByText('Email')).not.toBeInTheDocument();
  expect(screen.queryByText('Squirrel Name')).not.toBeInTheDocument();

  expect(screen.queryByText('Successful Submission')).toBeInTheDocument();
});

test('The backend reports a validation failure. Expect the form to remain visible.', async () => {
  //Arrange: When user clicks the form's submit button, report that the form was submitted successfully.
  const responseFromHttpGetRequest = Promise.resolve({
    isSuccess: false,
    isInternalError: false,
    validationFailures: { email: 'Not a valid email address' }
  } as FormResponse<TrainingRequestValidationFailures>);
  (submitFormikForm as jest.Mock).mockReturnValue(responseFromHttpGetRequest);  

  //Act: render form
  await act(async () => render(<CustomerSignup />));

  //Assert that the form is visible
  expect(screen.queryByText('Phone')).toBeInTheDocument();
  expect(screen.queryByText('Email')).toBeInTheDocument();
  expect(screen.queryByText('Squirrel Name')).toBeInTheDocument();

  //Act: fill in form and submit
  await act(async () => {
    typeOrFail('First Name', 'John');
    typeOrFail('Last Name', 'Smith');
    typeOrFail('Email', 'johnsmith-at-example-dot-com');
    typeOrFail('Phone', '1-212-555-1234');
    typeOrFail('Squirrel Name', 'Fluffy')
    typeOrFail(/Describe the training/i, 'Squirrel must learn to dance');
    
    const submitButton = screen.getByText('Register Squirrel');
    fireEvent.submit(submitButton);
  });

  //Assert the the form remains visible
  expect(screen.queryByText('Phone')).toBeInTheDocument();
  expect(screen.queryByText('Email')).toBeInTheDocument();
  expect(screen.queryByText('Squirrel Name')).toBeInTheDocument();

  expect(screen.queryByText('Successful Submission')).not.toBeInTheDocument();
});