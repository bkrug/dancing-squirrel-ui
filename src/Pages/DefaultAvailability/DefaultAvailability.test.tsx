import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { CreateEditDefaultAvailability, CreateEditDefaultDayAvailability } from '../../dtoModels';
import { getParsedResponse, submitFormWithResult } from '../../Forms/Submission/formikSubmission';
import { getFieldByName } from '../../testHelpers';
import DefaultAvailability from './DefaultAvailability';

jest.mock('../../Forms/Submission/formikSubmission', () => ({
  getParsedResponse: jest.fn(),
  submitFormWithResult: jest.fn()
}));

jest.mock('../../Auth/AuthContext', () => ({
  useAuth: jest.fn()
}));

const teacherId = 42;

function arrangeMocks(existingAvailability: CreateEditDefaultAvailability) {
  (useAuth as jest.Mock).mockReturnValue({ teacherId });

  (getParsedResponse as jest.Mock).mockImplementation((endpoint: string) =>
    (endpoint === `teacher/${teacherId}/availability`)
      ? Promise.resolve(Effect.succeed(existingAvailability))
      : Promise.resolve(Effect.fail({ isSuccess: false, isInternalError: true, validationFailures: {} }))
  );

  (submitFormWithResult as jest.Mock).mockImplementation((_endpoint: string, values: CreateEditDefaultAvailability) =>
    Promise.resolve(Effect.succeed(values))
  );
}

// Every row reuses the same labels, so fields are located by their Formik name instead.
function fillRow(index: number, dayOfWeek: string, startTime: string, endTime: string) {
  fireEvent.change(getFieldByName(`availabilities[${index}].dayOfWeek`), { target: { value: dayOfWeek } });
  fireEvent.change(getFieldByName(`availabilities[${index}].startTime`), { target: { value: startTime } });
  fireEvent.change(getFieldByName(`availabilities[${index}].endTime`), { target: { value: endTime } });
}

function getSubmittedAvailabilities() {
  const values = (submitFormWithResult as jest.Mock).mock.calls[0][1] as CreateEditDefaultAvailability;
  return values.availabilities;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('When no availability exists and two rows are added, the PUT to teacher/{teacherId}/availability contains both rows as entered.', async () => {
  // Arrange
  const monday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00' };
  const tuesday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Tuesday', startTime: '13:30', endTime: '17:00' };
  arrangeMocks({ availabilities: [] });
  render(<DefaultAvailability />);
  await act(async () => getParsedResponse);

  // Act
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(0, monday.dayOfWeek!, monday.startTime!, monday.endTime!);
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(1, tuesday.dayOfWeek!, tuesday.startTime!, tuesday.endTime!);
  fireEvent.click(screen.getByText('Save Availability'));

  // Assert
  await waitFor(() => expect(submitFormWithResult).toHaveBeenCalledTimes(1));
  expect(submitFormWithResult).toHaveBeenCalledWith(
    `teacher/${teacherId}/availability`,
    expect.anything(),
    expect.anything(),
    CreateEditDefaultAvailability,
    'PUT'
  );
  expect(getSubmittedAvailabilities()).toEqual([monday, tuesday]);
});

test('When availability already exists for Wednesday and two rows are added, the PUT contains availability for all three days.', async () => {
  // Arrange
  const monday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00' };
  const tuesday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Tuesday', startTime: '13:30', endTime: '17:00' };
  const wednesday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: 5, dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '14:00' };
  arrangeMocks({ availabilities: [wednesday] });
  render(<DefaultAvailability />);
  await act(async () => getParsedResponse);

  // Act
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(1, monday.dayOfWeek!, monday.startTime!, monday.endTime!);
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(2, tuesday.dayOfWeek!, tuesday.startTime!, tuesday.endTime!);
  fireEvent.click(screen.getByText('Save Availability'));

  // Assert
  await waitFor(() => expect(submitFormWithResult).toHaveBeenCalledTimes(1));
  expect(submitFormWithResult).toHaveBeenCalledWith(
    `teacher/${teacherId}/availability`,
    expect.anything(),
    expect.anything(),
    CreateEditDefaultAvailability,
    'PUT'
  );
  expect(getSubmittedAvailabilities()).toEqual([wednesday, monday, tuesday]);
});

test('When two rows are added and one is removed, the PUT contains availability for only the remaining day.', async () => {
  // Arrange
  const monday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00' };
  const tuesday: CreateEditDefaultDayAvailability = { defaultAvailabilityId: null, dayOfWeek: 'Tuesday', startTime: '13:30', endTime: '17:00' };
  arrangeMocks({ availabilities: [] });
  render(<DefaultAvailability />);
  await act(async () => getParsedResponse);

  // Act: add Monday and Tuesday, then remove the Monday row
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(0, monday.dayOfWeek!, monday.startTime!, monday.endTime!);
  fireEvent.click(screen.getByText('Add Row'));
  fillRow(1, tuesday.dayOfWeek!, tuesday.startTime!, tuesday.endTime!);
  fireEvent.click(screen.getAllByText('Remove')[0]);
  fireEvent.click(screen.getByText('Save Availability'));

  // Assert
  await waitFor(() => expect(submitFormWithResult).toHaveBeenCalledTimes(1));
  expect(submitFormWithResult).toHaveBeenCalledWith(
    `teacher/${teacherId}/availability`,
    expect.anything(),
    expect.anything(),
    CreateEditDefaultAvailability,
    'PUT'
  );
  expect(getSubmittedAvailabilities()).toEqual([tuesday]);
});
