import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Event from './Event';

const testEvent = {
  title: 'test',
  event_id: 1,
  location: 'somewhere',
  start_time: "2023-03-31T18:00:00.000Z",
  end_time: "2023-03-31T19:00:00.000Z"
}

test('renders the component', () => {
  renderWithProviders(<Event event={testEvent}/>);
  const eventElement = screen.getByText(/somewhere/i);
  expect(eventElement).toBeInTheDocument();
});

test('positions the event correctly for morning events', () => {
  renderWithProviders(<Event event={testEvent} />);
  let eventElement = screen.getByTestId('test_event');
  expect(eventElement).toHaveStyle(`transform: translateY(-400px) translateX(96px)`)
});

test('positions the event correctly for afternoon events', () => {
  renderWithProviders(<Event event={Object.assign(testEvent, {
    start_time: "2023-03-31T13:00:00.000Z",
    end_time: "2023-03-31T14:00:00.000Z"
  })} />);
  let eventElement = screen.getByTestId('test_event');
  expect(eventElement).toHaveStyle(`transform: translateY(-800px) translateX(96px)`)
});

test('handle click function', () => {
  let handleClick = jest.fn()
  renderWithProviders(<Event event={testEvent} handleClick={handleClick}/>);
  let eventElement = screen.getByText(/somewhere/i);
  fireEvent.click(eventElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick.mock.calls[0][1]).toEqual(testEvent)
})
