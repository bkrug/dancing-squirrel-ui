import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { useNavigate } from 'react-router';
import { FormResponse } from '../../Forms/Submission/formResponse';
import { submitFormikJson } from '../../Forms/Submission/formikSubmission';
import { getInputOrTextArea } from '../../testHelpers';
import CreateUser from './CreateUser';

jest.mock('../../Forms/Submission/formikSubmission', () => ({
  submitFormikJson: jest.fn()
}));

jest.mock('react-router', () => ({
  useNavigate: jest.fn()
}));

test('When the create user form is filled in and submitted, the input is POSTed to user and the app navigates to /users.', async () => {
  // Arrange
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const responseFromPost = Promise.resolve({ isSuccess: true } as FormResponse<object>);
  (submitFormikJson as jest.Mock).mockReturnValue(responseFromPost);

  render(<CreateUser />);

  // Act: fill in the form and submit
  fireEvent.change(getInputOrTextArea('Username')!, { target: { value: 'newuser' } });
  fireEvent.change(getInputOrTextArea('Password')!, { target: { value: 'secret123' } });
  fireEvent.change(getInputOrTextArea('Email')!, { target: { value: 'newuser@example.com' } });
  fireEvent.change(getInputOrTextArea('Phone Number')!, { target: { value: '555-4321' } });

  fireEvent.submit(screen.getByText('Create User'));
  await act(async () => responseFromPost);

  // Assert the form values were POSTed to the correct endpoint
  expect(submitFormikJson).toHaveBeenCalledWith(
    'user',
    expect.objectContaining({
      username: 'newuser',
      password: 'secret123',
      email: 'newuser@example.com',
      phoneNumber: '555-4321'
    }),
    expect.anything(),
    'POST'
  );

  // Assert the app navigated to /users
  expect(mockNavigate).toHaveBeenCalledWith('/users');
});
