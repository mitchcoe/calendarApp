import { screen } from '@testing-library/react';
import renderWithProviders from './utils/test_utils'
import App from './App';

test('renders the app', () => {
  renderWithProviders(<App />);
  const timeElement = screen.getByTestId("app_container");
  expect(timeElement).toBeInTheDocument();
});
