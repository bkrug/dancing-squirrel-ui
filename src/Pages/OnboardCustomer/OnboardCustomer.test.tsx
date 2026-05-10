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

test('Given a training request id that exists (the client has not yet been onboarded), renders a description of that training request.', async () => {
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
    organizationName: null,
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

