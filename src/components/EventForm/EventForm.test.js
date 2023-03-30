import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import EventForm from './EventForm';

const testProps = [{
  handleClick: null, 
  eventId: 1, 
  handleClose: null
}]

test('renders the component', () => {
  renderWithProviders(<EventForm props={testProps}/>);
  const formElement = screen.getByTestId("event_form");
  expect(formElement).toBeInTheDocument();
});