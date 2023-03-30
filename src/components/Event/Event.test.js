import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Event from './Event';

const testEvent = {
  title: 'test',
  event_id: 1,
  location: 'somewhere'
}

test('renders the component', () => {
  renderWithProviders(<Event event={testEvent}/>);
  const eventElement = screen.getByText(/somewhere/i);
  expect(eventElement).toBeInTheDocument();
});