import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Teacher, ViewUserModel } from '../../dtoModels';
import { getPagedData, getParsedResponse, submitFormikJson } from '../../Forms/Submission/formikSubmission';
import EditUser from './EditUser';

jest.mock('../../Forms/Submission/formikSubmission', () => ({
  getParsedResponse: jest.fn(),
  getPagedData: jest.fn(),
  submitFormikJson: jest.fn()
}));

jest.mock('react-router', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

const mockTeachers: Teacher[] = [
  { teacherId: 3, firstName: 'Ada', lastName: 'Lovelace' },
  { teacherId: 7, firstName: 'Grace', lastName: 'Hopper' },
  { teacherId: 12, firstName: 'Alan', lastName: 'Turing' }
];

function arrangeMocks(mockUser: ViewUserModel) {
  (useParams as jest.Mock).mockReturnValue({ userId: mockUser.userId });
  (useNavigate as jest.Mock).mockReturnValue(jest.fn());

  (getParsedResponse as jest.Mock).mockImplementation((endpoint: string) => {
    if (endpoint === 'user/' + mockUser.userId)
      return Promise.resolve(Effect.succeed(mockUser));
    if (endpoint === 'teacher')
      return Promise.resolve(Effect.succeed(mockTeachers));
    return Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }));
  });

  (getPagedData as jest.Mock).mockImplementation(() =>
    Promise.resolve(Effect.succeed({ data: ['Admin'] }))
  );

  (submitFormikJson as jest.Mock).mockResolvedValue({ isSuccess: true, isInternalError: false, validationFailures: {} });
}

function getMockUser(initialTeacherId: number | null): ViewUserModel {
  return {
    userId: '29e65279-bfce-4bf3-a49e-3969a6715cbd',
    username: 'jdoe',
    email: 'jdoe@example.com',
    phoneNumber: '555-9876',
    roles: [{ name: 'Admin' }],
    teacherId: initialTeacherId
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('When teacherId is initially null and a teacher is selected, a PUT request is made to user/{userId}/claims with the selected teacherId.', async () => {
  // Arrange
  const initialTeacherId = null;
  const newTeacherId = 7;
  const mockUser = getMockUser(initialTeacherId);
  arrangeMocks(mockUser);

  render(<EditUser editingOwnData={false} />);
  await act(async () => getParsedResponse);
  await act(async () => getPagedData);

  // Act: select Grace Hopper and submit
  fireEvent.change(screen.getByRole('combobox'), { target: { value: newTeacherId.toString() } });
  fireEvent.click(screen.getByText('Save User Claims'));

  // Assert
  await waitFor(() => expect(submitFormikJson).toHaveBeenCalledTimes(1));
  expect(submitFormikJson).toHaveBeenCalledWith(
    `user/${mockUser.userId}/claims`,
    { teacherId: newTeacherId },
    expect.anything(),
    'PUT'
  );
});

test('When teacherId is initially set and "-- Select --" is chosen, a PUT request is made to user/{userId}/claims with a null teacherId.', async () => {
  // Arrange
  const initialTeacherId = 12;
  const newTeacherId = null;
  const mockUser = getMockUser(initialTeacherId);
  arrangeMocks(mockUser);

  render(<EditUser editingOwnData={false} />);
  await act(async () => getParsedResponse);
  await act(async () => getPagedData);
  expect(screen.getByRole('combobox')).toHaveValue(initialTeacherId.toString());

  // Act: clear the selection and submit
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
  fireEvent.click(screen.getByText('Save User Claims'));

  // Assert
  await waitFor(() => expect(submitFormikJson).toHaveBeenCalledTimes(1));
  expect(submitFormikJson).toHaveBeenCalledWith(
    `user/${mockUser.userId}/claims`,
    { teacherId: newTeacherId },
    expect.anything(),
    'PUT'
  );
});
