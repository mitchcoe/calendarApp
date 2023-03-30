import { render, screen } from '@testing-library/react';
import renderWithProviders from './utils/test_utils'
import App from './App';

test('renders the app', () => {
  renderWithProviders(<App />);
  const timeElement = screen.getByText(/8AM/i);
  expect(timeElement).toBeInTheDocument();
});
