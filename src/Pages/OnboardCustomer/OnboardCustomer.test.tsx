import { render, screen } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { CaretakerType } from '../../enums';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { getSiblingByText } from '../../testhelpers';
import OnboardCustomer from './OnboardCustomer';

jest.mock('../../Forms/Submission/formikSubmission', () => {
  return {
    getParsedResponse: jest.fn()
  }
});

test('Given a training request id that exists, with a person as a caretaker, and the client has not yet been onboarded. Expect rendering a description of that training request.', async () => {
  //Arrange
  const mockedUseNavigate = jest.fn();
  jest.mock('react-router', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockedUseNavigate,
    useParams: () => ({ trainingRequestId: '5' }),
  }));

  const recFromDb: TrainingRequest = {
    trainingRequestId: 5,
    squirrelName: 'Mittens',
    caretakerType: CaretakerType.Person,
    organizationName: 'This value would be null in real life. But even if it is non-null, we should not render the company name.',
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
  await act(async () => {
    render(<OnboardCustomer />);
  });

  //Asert that child element was rendered
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
  const mockedUseNavigate = jest.fn();
  jest.mock('react-router', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockedUseNavigate,
    useParams: () => ({ trainingRequestId: '7' }),
  }));

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
  await act(async () => {
    render(<OnboardCustomer />);
  });

  //Asert that child element was rendered
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

test('Given a training request id that exists, with a person as a caretaker, and the client has already been onboarded. Expect rendering a description of that training request.', async () => {
  //Arrange
  const mockedUseNavigate = jest.fn();
  jest.mock('react-router', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockedUseNavigate,
    useParams: () => ({ trainingRequestId: '6' }),
  }));

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
  await act(async () => {
    render(<OnboardCustomer />);
  });

  //Asert that child element was rendered
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