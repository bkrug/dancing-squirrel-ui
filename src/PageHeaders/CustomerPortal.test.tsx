import { render, screen } from '@testing-library/react';
import CustomerPortal from './CustomerPortal';

test('renders learn react link', () => {
  render(<CustomerPortal child={<h2 className='expect-in-test'>Child Element used for Unit Test</h2>}/>);

  //Asert that child element was rendered
  const linkElement = screen.getByText(/Child Element used for Unit Test/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.className).toEqual('expect-in-test');
});
