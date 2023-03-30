import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Day from './Day';

test('renders the component', () => {
  renderWithProviders(<Day />);
  const dayElement = screen.getByText(/8AM/i);
  expect(dayElement).toBeInTheDocument();
});