import { render, screen } from '@testing-library/react';
import { Effect } from 'effect';
import { act } from 'react';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { GenericModelResponse } from '../../Forms/Submission/formResponse';
import OnboardCustomer from './OnboardCustomer';

// Given a big of text that exists in one element in the document,
// return the element's sibling that comes directly after the element.
function getSiblingByText(selfContents: RegExp | string) {
  const linkElement = screen.getByText(selfContents);
  const siblings = linkElement.parentElement && linkElement.parentElement.childNodes
    ? Array.from(linkElement.parentElement.childNodes)
    : [];
  const selfIndex = siblings.indexOf(linkElement);
  const siblingIndex = selfIndex >= 0 ? selfIndex + 1 : -1;
  return siblingIndex >= 0 && siblingIndex < siblings.length
    ? siblings[selfIndex + 1]
    : null;
}

jest.mock('../../Forms/Submission/formikSubmission', () => {
  const effectModule = jest.requireActual('effect');
  const enumModule = jest.requireActual('../../enums');

  const recFromDb: TrainingRequest = {
    trainingRequestId: 5,
    squirrelName: 'Mittens',
    caretakerType: enumModule.CaretakerType.Person,
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

  return {
    getParsedResponse: async <TParsed extends object>(endpoint: string, constructor: { new (): TParsed}, methodVerb?: string) => {
      const retVal = effectModule.Effect.succeed(recFromDb);
      return retVal as Effect.Effect<TrainingRequest, GenericModelResponse<string>, never>
    }
  }
});

test('renders learn react link', async () => {
  //Arrange
  const mockedUseNavigate = jest.fn();
  jest.mock('react-router', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockedUseNavigate,
    useParams: () => ({ trainingRequestId: '5' }),
  }));

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

