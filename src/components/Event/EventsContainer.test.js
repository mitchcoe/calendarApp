import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import EventsContainer from './EventsContainer';

const mockEvent = [{
  event_id: 1,
  handleClick : null
}]

test('renders the component', () => {
  renderWithProviders(<EventsContainer events={mockEvent}/>);
  const containerElement = screen.getByTestId("event_container");
  expect(containerElement).toBeInTheDocument();
});