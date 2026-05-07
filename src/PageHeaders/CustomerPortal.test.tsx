import { render, screen } from '@testing-library/react';
import CustomerPortal from './CustomerPortal';

test('renders learn react link', () => {
  render(<CustomerPortal child={<h2>Hello, World!</h2>}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
