import { fireEvent, render, screen } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { CaretakerType } from '../../enums';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { GenericModelResponse } from '../../Forms/Submission/formResponse';
import { getSiblingByText } from '../../testhelpers';
import OnboardCustomer from './OnboardCustomer';

jest.mock('../../Forms/Submission/formikSubmission', () => {
  return {
    getParsedResponse: jest.fn()
  }
});

const mockedUserParams = jest.fn();
jest.mock('react-router', () => ({
  useParams: () => mockedUserParams,
}));

//TODO: Assert that the 'Onboard' button is included in the DOM.
test('Given a training request id that exists, with a person as a caretaker, and the client has not yet been onboarded. Expect rendering a description of that training request.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '5' });

  const recFromDb: TrainingRequest = {
    trainingRequestId: 5,
    squirrelName: 'Mittens',
    caretakerType: CaretakerType.Person,
    organizationName: 'This value would be null in real life, but rending a person-view vs company-view shoud depend on the "caretakerType" field.',
    ownerLastName: 'Robinson',
    ownerFirstName: 'Mrs.',
    email: 'song@beatles.com',
    phone: '12125550000',
    squirrelId: null,
    onboardUsername: null,
    onboardingDateTimeUnix: null,
    descriptionOfNeeds: 'This squirrel has potential to exploit'
  };
  const responseFromHttpGetRequest = Promise.resolve(Effect.succeed(recFromDb));
  (getParsedResponse as jest.Mock).mockReturnValueOnce(responseFromHttpGetRequest);

  //Act
  await act(async () => render(<OnboardCustomer />));

  //Assert
  expect(getSiblingByText(/Is Onboarded/i)?.textContent).toEqual('No');
  expect(getSiblingByText(/Squrriel Name/i)?.textContent).toEqual('Mittens');
  expect(getSiblingByText(/Caretaker Type/i)?.textContent).toEqual('individual');
  expect(getSiblingByText(/Caretaker Name/i)?.textContent).toEqual('Robinson, Mrs.');
  expect(getSiblingByText(/Email/i)?.textContent).toEqual('song@beatles.com');
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('1(212) 555-0000');
  expect(getSiblingByText(/Description of Needs/i)?.textContent).toEqual('This squirrel has potential to exploit');
  expect(screen.queryByText(/Employee who did Onboarding/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Date of Onboarding/i)).not.toBeInTheDocument();
});

test('Given a training request id that exists, with a company as a caretaker, and the client has not yet been onboarded. Expect rendering a description of that training request.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '7' });

  const recFromDb: TrainingRequest = {
    trainingRequestId: 7,
    squirrelName: 'Mittens',
    caretakerType: CaretakerType.Company,
    organizationName: 'Acme Overloards, Inc.',
    ownerLastName: null,
    ownerFirstName: null,
    email: 'song@beatles.com',
    phone: '12125550000',
    squirrelId: null,
    onboardUsername: null,
    onboardingDateTimeUnix: null,
    descriptionOfNeeds: 'This squirrel has potential to exploit'
  };
  const responseFromHttpGetRequest = Promise.resolve(Effect.succeed(recFromDb));
  (getParsedResponse as jest.Mock).mockReturnValueOnce(responseFromHttpGetRequest);

  //Act
  await act(async () => render(<OnboardCustomer />));

  //Assert
  expect(getSiblingByText(/Is Onboarded/i)?.textContent).toEqual('No');
  expect(getSiblingByText(/Squrriel Name/i)?.textContent).toEqual('Mittens');
  expect(getSiblingByText(/Caretaker Type/i)?.textContent).toEqual('organization');
  expect(getSiblingByText(/Caretaker Name/i)?.textContent).toEqual('Acme Overloards, Inc.');
  expect(getSiblingByText(/Email/i)?.textContent).toEqual('song@beatles.com');
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('1(212) 555-0000');
  expect(getSiblingByText(/Description of Needs/i)?.textContent).toEqual('This squirrel has potential to exploit');
  expect(screen.queryByText(/Employee who did Onboarding/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Date of Onboarding/i)).not.toBeInTheDocument();
});

//TODO: Assert that the 'Onboard' button is omitted or invisible
test('Given a training request id that exists, with a person as a caretaker, and the client has already been onboarded. Expect rendering a description of that training request.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '6' });

  const recFromDb: TrainingRequest = {
    trainingRequestId: 6,
    squirrelName: 'Mittens',
    caretakerType: CaretakerType.Person,
    organizationName: null,
    ownerLastName: 'Robinson',
    ownerFirstName: 'Susan',
    email: 'song@beatles.com',
    phone: '12125550000',
    squirrelId: 1005,
    onboardUsername: 'someUser',
    onboardingDateTimeUnix: 62*60,
    descriptionOfNeeds: 'This squirrel has potential to exploit'
  };
  const responseFromHttpGetRequest = Promise.resolve(Effect.succeed(recFromDb));
  (getParsedResponse as jest.Mock).mockReturnValueOnce(responseFromHttpGetRequest);

  //Act
  await act(async () => render(<OnboardCustomer />));

  //Assert
  expect(getSiblingByText(/Is Onboarded/i)?.textContent).toEqual('Yes');
  expect(getSiblingByText(/Squrriel Name/i)?.textContent).toEqual('Mittens');
  expect(getSiblingByText(/Caretaker Type/i)?.textContent).toEqual('individual');
  expect(getSiblingByText(/Caretaker Name/i)?.textContent).toEqual('Robinson, Susan');
  expect(getSiblingByText(/Email/i)?.textContent).toEqual('song@beatles.com');
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('1(212) 555-0000');
  expect(getSiblingByText(/Description of Needs/i)?.textContent).toEqual('This squirrel has potential to exploit');
  expect(getSiblingByText(/Employee who did Onboarding/i)?.textContent).toEqual('someUser');
  expect(getSiblingByText(/Date of Onboarding/i)?.textContent).toEqual('1970-01-01T01:02:00.000Z');
});

test('Given a training request with a phone number that is missing the area code. Expect the phone number to be rendered correctly, but omitting the area code.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '5' });

  const recFromDb: TrainingRequest = {
    trainingRequestId: 5,
    squirrelName: 'Mittens',
    caretakerType: CaretakerType.Person,
    organizationName: 'This value would be null in real life. But even if it is non-null, we should not render the company name.',
    ownerLastName: 'Robinson',
    ownerFirstName: 'Mrs.',
    email: 'song@beatles.com',
    phone: '4145552222',
    squirrelId: null,
    onboardUsername: null,
    onboardingDateTimeUnix: null,
    descriptionOfNeeds: 'This squirrel has potential to exploit'
  };
  const responseFromHttpGetRequest = Promise.resolve(Effect.succeed(recFromDb));
  (getParsedResponse as jest.Mock).mockReturnValueOnce(responseFromHttpGetRequest);

  //Act
  await act(async () => render(<OnboardCustomer />));

  //Assert
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('(414) 555-2222');
});

test('Given a training request id that does not exist. Expect a failure message to be displayed to the user.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '1001' });

  const failureObj : GenericModelResponse<string> = {
    isSuccess: false,
    isInternalError: false,
    validationFailures: 'Not Found'
  }
  const responseFromHttpGetRequest = Promise.resolve(Effect.fail(failureObj));
  (getParsedResponse as jest.Mock).mockReturnValueOnce(responseFromHttpGetRequest);

  //Act
  await act(async () => render(<OnboardCustomer />));

  //Assert
  expect(screen.queryByText(/Not Found/i)).toBeInTheDocument();

  expect(screen.queryByText(/Is Onboarded/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Squrriel Name/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Caretaker Type/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Caretaker Name/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Phone/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Description of Needs/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Employee who did Onboarding/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Date of Onboarding/i)).not.toBeInTheDocument();
});

test('When a user presses the "Onboard" button, a POST request should be made.', async () => {
  //Arrange
  mockedUserParams.mockRejectedValue({ trainingRequestId: '13' });

  const recBeforeOnboarding: TrainingRequest = {
    trainingRequestId: 13,
    squirrelName: 'Pooh Squirrel',
    caretakerType: CaretakerType.Person,
    organizationName: 'This value would be null in real life. But even if it is non-null, we should not render the company name.',
    ownerLastName: 'Robinson',
    ownerFirstName: 'Christopher',
    email: 'song@beatles.com',
    phone: '12125550000',
    squirrelId: null,
    onboardUsername: null,
    onboardingDateTimeUnix: null,
    descriptionOfNeeds: 'Squirrel is easily distracted by honey'
  };
  const recAfterOnboarding: TrainingRequest = {
    trainingRequestId: 13,
    squirrelName: 'Pooh Squirrel',
    caretakerType: CaretakerType.Person,
    organizationName: 'This value would be null in real life. But even if it is non-null, we should not render the company name.',
    ownerLastName: 'Robinson',
    ownerFirstName: 'Christopher',
    email: 'song@beatles.com',
    phone: '12125550000',
    squirrelId: 4782,
    onboardUsername: 'customerServiceUser',
    onboardingDateTimeUnix: 60*60*24*365*2,
    descriptionOfNeeds: 'Squirrel is easily distracted by honey'
  };
  const actualHttpVerbs : string[] = [];
  (getParsedResponse as jest.Mock).mockImplementation(
      async <TParsed extends object>(endpoint: string, constructor: { new (): TParsed}, methodVerb?: string) => {
        actualHttpVerbs.push(methodVerb || '');
        return methodVerb === 'GET' ? Effect.succeed(recBeforeOnboarding) : Effect.succeed(recAfterOnboarding)
      }
    );

  //Act
  await act(async () => {
    render(<OnboardCustomer />);
  });

  //Assert that client has not yet been onboarded
  expect(actualHttpVerbs).toEqual(['GET']);

  expect(getSiblingByText(/Is Onboarded/i)?.textContent).toEqual('No');
  expect(screen.queryByText(/Employee who did Onboarding/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Date of Onboarding/i)).not.toBeInTheDocument();

  expect(getSiblingByText(/Squrriel Name/i)?.textContent).toEqual('Pooh Squirrel');
  expect(getSiblingByText(/Caretaker Type/i)?.textContent).toEqual('individual');
  expect(getSiblingByText(/Caretaker Name/i)?.textContent).toEqual('Robinson, Christopher');
  expect(getSiblingByText(/Email/i)?.textContent).toEqual('song@beatles.com');
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('1(212) 555-0000');
  expect(getSiblingByText(/Description of Needs/i)?.textContent).toEqual('Squirrel is easily distracted by honey');

  //Act to press the 'Onboard' button
  await act(async () => {
    const onboardButton = screen.getByText(/Onboard Squirrel/i);
    fireEvent.click(onboardButton);
  });

  //Assert that client has not yet been onboarded
  expect(actualHttpVerbs).toEqual(['GET', 'POST']);

  expect(getSiblingByText(/Is Onboarded/i)?.textContent).toEqual('Yes');
  expect(getSiblingByText(/Employee who did Onboarding/i)?.textContent).toEqual('customerServiceUser');
  expect(getSiblingByText(/Date of Onboarding/i)?.textContent).toEqual('1972-01-01T00:00:00.000Z');

  expect(getSiblingByText(/Squrriel Name/i)?.textContent).toEqual('Pooh Squirrel');
  expect(getSiblingByText(/Caretaker Type/i)?.textContent).toEqual('individual');
  expect(getSiblingByText(/Caretaker Name/i)?.textContent).toEqual('Robinson, Christopher');
  expect(getSiblingByText(/Email/i)?.textContent).toEqual('song@beatles.com');
  expect(getSiblingByText(/Phone/i)?.textContent).toEqual('1(212) 555-0000');
  expect(getSiblingByText(/Description of Needs/i)?.textContent).toEqual('Squirrel is easily distracted by honey');
});