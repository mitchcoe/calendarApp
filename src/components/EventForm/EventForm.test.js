import { screen, fireEvent, cleanup } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import EventForm from './EventForm';

const testProps = [{
  handleClick: jest.fn(), 
  eventId: 1, 
  handleClose: jest.fn()
}];

const defaultEvent = {
  title: 'event_placing_test',
  description: 'testing event creation on the front end',
  location: 'Austin, TX',
  date: '2023-03-21',
  start_time: '2023-03-21 09:45:00',
  end_time: '2023-03-21 12:30:00'
};

const defaultFormState = {
  anchorType: 'Create',
  valid: true,
  editing: true,
  ...defaultEvent,
};

const createCustomComponent = (options) => {
  if(options) {
    return renderWithProviders(<EventForm props={testProps}/>, {
      preloadedState: {
        form: {
          ...defaultFormState
        }
      }
    })
  } else {
    return renderWithProviders(<EventForm props={testProps}/>);
  }
}

xtest('renders the component', () => {
  createCustomComponent()
  const formElement = screen.getByTestId("event_form");
  expect(formElement).toBeInTheDocument();
});

xtest('shows the correct error message for the time picker component', () => {
  const onChange = jest.fn((callback) => callback());
  createCustomComponent(true)
  let formElement = screen.getByLabelText("Start Time");
  // let formElement = screen.getByTestId("error_message");
  fireEvent.change(formElement,{target: {value: 'error'}})
  console.log(formElement.getAttribute('helperText'))
  expect(formElement).toBeInTheDocument();
  expect(onChange).toHaveBeenCalled()
  expect(formElement.getAttribute('helperText')).toBe(null)
});

xtest('createEvent function', () => {

});

xtest('updateEvent function', () => {

});

xtest('deleteEvent function', () => {

});

xtest('handleCreateSubmit function', () => {

});

xtest('handleUpdateSubmit function', () => {

});

xtest('handleDelete function', () => {

});

xtest('handleClear function', () => {

});

xtest('handleFieldChange function', () => {

});

xtest('handeDateFieldChange function', () => {

});

xtest('handleStartTimeFieldChange function', () => {

});

xtest('handleEndTimeFieldChange function', () => {

});

xtest('handleEditToggle function', () => {

});

xtest('handleError function', () => {

});

xtest('handleModalCloseAndDelete function', () => {

});
