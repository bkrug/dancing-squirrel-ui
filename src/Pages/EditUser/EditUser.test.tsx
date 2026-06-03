import { fireEvent, render, screen } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getPagedData, getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { getInputOrTextArea } from '../../testHelpers';
import EditUser from './EditUser';

jest.mock('../../Forms/Submission/formikSubmission', () => ({
  getParsedResponse: jest.fn(),
  getPagedData: jest.fn()
}));

jest.mock('react-router', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

test('When editingOwnData is false, email and phone fields are populated from user/{userId}, a delete button is shown, and one role switch appears per role from the role endpoint.', async () => {
  // Arrange
  const mockUser = {
    userId: '29e65279-bfce-4bf3-a49e-3969a6715cbd',
    username: 'jdoe',
    email: 'jdoe@example.com',
    phoneNumber: '555-9876',
    roles: [{ name: 'Admin' }]
  };
  const rolesFromEndpoint = ['Admin', 'Onboarder', 'Teacher'];

  (useParams as jest.Mock).mockReturnValue({ userId: mockUser.userId });
  (useNavigate as jest.Mock).mockReturnValue(jest.fn());

  (getParsedResponse as jest.Mock).mockImplementation((endpoint: string) => {
    if (endpoint === 'user/' + mockUser.userId)
      return Promise.resolve(Effect.succeed(mockUser));
    return Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }));
  });

  (getPagedData as jest.Mock).mockImplementation((endpoint: string) => {
    if (endpoint === 'role')
      return Promise.resolve(Effect.succeed({ data: rolesFromEndpoint }));
    return Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }));
  });

  // Act
  render(<EditUser editingOwnData={false} />);
  await act(async () => getParsedResponse);
  await act(async () => getPagedData);

  // Assert email and phone fields are visible and populated
  expect(getInputOrTextArea('Email')).toHaveValue(mockUser.email);
  expect(getInputOrTextArea('Phone Number')).toHaveValue(mockUser.phoneNumber);

  // Assert delete button is present
  expect(screen.queryByText('Delete')).toBeInTheDocument();

  // Assert one role switch per role from the role endpoint
  expect(screen.getByText('Admin')).toBeInTheDocument();
  expect(screen.getByText('Onboarder')).toBeInTheDocument();
  expect(screen.getByText('Teacher')).toBeInTheDocument();
  expect(screen.getAllByRole('switch')).toHaveLength(rolesFromEndpoint.length);
});

test('When editingOwnData is true, email and phone fields are populated from user/self, with no delete button and no role switches.', async () => {
  // Arrange
  const mockUser = {
    userId: '29e65279-bfce-4bf3-a49e-3969a6715cbd',
    username: 'selfuser',
    email: 'me@example.com',
    phoneNumber: '555-1111',
    roles: [{ name: 'Staff' }]
  };

  (useParams as jest.Mock).mockReturnValue({});

  (getParsedResponse as jest.Mock).mockImplementation((endpoint: string) => {
    if (endpoint === 'user/self')
      return Promise.resolve(Effect.succeed(mockUser));
    return Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }));
  });

  // Act
  render(<EditUser editingOwnData={true} />);
  await act(async () => getParsedResponse);

  // Assert email and phone fields are visible and populated
  expect(getInputOrTextArea('Email')).toHaveValue(mockUser.email);
  expect(getInputOrTextArea('Phone Number')).toHaveValue(mockUser.phoneNumber);

  // Assert no delete button
  expect(screen.queryByText('Delete')).not.toBeInTheDocument();

  // Assert no role switches
  expect(screen.queryAllByRole('switch')).toHaveLength(0);
});

test('When the delete button is pressed and confirmed, a DELETE request is made to user/{userId} and the app navigates to /users.', async () => {
  // Arrange
  const mockUser = {
    userId: '29e65279-bfce-4bf3-a49e-3969a6715cbd',
    username: 'jdoe',
    email: 'jdoe@example.com',
    phoneNumber: '555-9876',
    roles: [{ name: 'Admin' }]
  };
  const mockNavigate = jest.fn();

  (useParams as jest.Mock).mockReturnValue({ userId: mockUser.userId });
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  (getParsedResponse as jest.Mock).mockImplementation((endpoint: string, _constructor: unknown, method?: string) => {
    if (endpoint === 'user/' + mockUser.userId && method === 'DELETE')
      return Promise.resolve(Effect.succeed(true));
    if (endpoint === 'user/' + mockUser.userId)
      return Promise.resolve(Effect.succeed(mockUser));
    return Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }));
  });

  (getPagedData as jest.Mock).mockImplementation(() =>
    Promise.resolve(Effect.succeed({ data: ['Admin'] }))
  );

  render(<EditUser editingOwnData={false} />);
  await act(async () => getParsedResponse);
  await act(async () => getPagedData);

  // Act: click Delete, then confirm in the modal
  fireEvent.click(screen.getByText('Delete'));
  fireEvent.click(screen.getByText('Yes'));
  await act(async () => getParsedResponse);

  // Assert DELETE was called and navigation occurred
  expect(getParsedResponse).toHaveBeenCalledWith('user/' + mockUser.userId, Boolean, 'DELETE');
  expect(mockNavigate).toHaveBeenCalledWith('/users');
});
