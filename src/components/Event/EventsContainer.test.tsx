import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import EventsContainer from './EventsContainer';
import { EventType, HandleClickType } from '../../globalTypes';

const mockEvent: EventType = {
  title: 'test',
  event_id: 1,
  location: 'somewhere',
  start_time: "2023-03-31T18:00:00.000Z",
  end_time: "2023-03-31T19:00:00.000Z",
  date:'2023-03-31',
  color: '#2196f3'
};

const handleClick: HandleClickType = jest.fn();

const testProps = {
  events: [mockEvent],
  handleClick,
};

test('renders the component', () => {
  renderWithProviders(<EventsContainer {...testProps}/>);
  const containerElement = screen.getByTestId("event_container");
  expect(containerElement).toBeInTheDocument();
});