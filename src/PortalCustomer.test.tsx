import { render, screen } from '@testing-library/react';
import PortalCustomer from './PortalCustomer';

test('renders learn react link', () => {
  render(<PortalCustomer child={<h2>Hello, World!</h2>}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
