import React from 'react';
import { render, screen } from '@testing-library/react';
import PortalCustomer from './PortalCustomer';

test('renders learn react link', () => {
  render(<PortalCustomer />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
