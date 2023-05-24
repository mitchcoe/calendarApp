import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import RemindersQueue from './RemindersQueue';

const testProps= {
  events: []
};

test('renders the component', () => {
  renderWithProviders(<RemindersQueue {...testProps}/>);
  const dayElement = screen.getByTestId('reminders_queue');
  expect(dayElement).toBeInTheDocument();
});