import { screen, fireEvent, debug, render, waitForElementToBeRemoved, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer';
import renderWithProviders from '../../utils/test_utils'
import EventForm from './EventForm';

const testProps = {
  handleClick: jest.fn(), 
  handleClose: jest.fn(),
  eventId: 1, 
};

const defaultEvent = {
  title: 'event_form_test',
  description: 'testing event creation on the front end',
  location: 'Austin, TX',
  date: '2023-04-21',
  start_time: '2023-04-21 09:45:00',
  end_time: '2023-04-21 12:30:00'
};

const defaultFormState = {
  anchorType: 'Create',
  valid: true,
  editing: true,
  open: true,
  ...defaultEvent,
};

const editReduxState = (state) => {
  let newState = Object.assign(defaultFormState, {...state})
  return newState;
}

const createCustomComponent = (options = defaultFormState) => {
  return renderWithProviders(<EventForm {...testProps}/>, {
    preloadedState: {
      form: {
        ...options
      }
    }
  })
};

// beforeAll(() => {
//   // add window.matchMedia
//   // this is necessary for the date picker to be rendered in desktop mode.
//   // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
//   Object.defineProperty(window, "matchMedia", {
//     writable: true,
//     value: (query) => ({
//       media: query,
//       // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
//       matches: query === "(pointer: fine)",
//       onchange: () => {},
//       addEventListener: () => {},
//       removeEventListener: () => {},
//       addListener: () => {},
//       removeListener: () => {},
//       dispatchEvent: () => false,
//     }),
//   });
// });

// afterAll(() => {
//   delete window.matchMedia;
// });

test('renders the component', () => { //works
  createCustomComponent()
  const formElement = screen.getByTestId("event_form");
  expect(formElement).toBeInTheDocument();
});

xtest('shows the correct error message for the time picker component', () => { //related to time picker stuff
  const onChange = jest.fn((callback) => callback());
  createCustomComponent()
  let formElement = screen.getByLabelText("Start Time");
  expect(formElement).toBeInTheDocument();
  // let formElement = screen.getByTestId("error_message");
  fireEvent.change(formElement,{target: {value: 'invalidDate'}})
  console.log(formElement.getAttribute('helperText'))
  // expect(onChange).toHaveBeenCalled()
  expect(formElement.getAttribute('helperText')).toBe(null)
});

xtest('createEvent function', () => {

});

xtest('updateEvent function', () => {

});

xtest('deleteEvent function', () => {

});

test('handleCreateSubmit function', async () => { //works
  createCustomComponent();
  let test = screen.getByTestId('submit_button')
  expect(test).toHaveTextContent('Create')
  userEvent.click(test)
  expect(testProps.handleClose).toHaveBeenCalled()
});

test('handleUpdateSubmit function', () => { //works
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  let test = screen.getByTestId('submit_button')
  expect(test).toHaveTextContent('Update')
  userEvent.click(test)
  expect(testProps.handleClose).toHaveBeenCalled()
});

describe('Delete Modal functions', () => { //works
  let modalArgs = ['presentation', {name: 'Are You Sure You Want To Delete This Event?'}];
  let modal;
  let deleteButton
  let closeModalButton;
  let deleteModalButton;

  const setupModal = () => {
    createCustomComponent(editReduxState({anchorType: 'Update'}));
    deleteButton = screen.getByTestId('delete_button')
    userEvent.click(deleteButton)
    modal = screen.getByRole(...modalArgs)
    closeModalButton = screen.getByTestId('modal_close_button')
    deleteModalButton = screen.getByTestId('modal_delete_button')
  }

  const closeModal = () => {
    userEvent.click(closeModalButton)
    // expect(testProps.handleClose).toHaveBeenCalled()
  }

  test('opening the modal', () => { //works
    setupModal()
    expect(deleteButton).toBeInTheDocument()
    expect(closeModalButton).toBeInTheDocument()
    expect(deleteModalButton).toBeInTheDocument()
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveTextContent('Are You Sure You Want To Delete This Event?')
    closeModal()
  });

  test('closing the modal', () => { //works
    setupModal();
    closeModal();
    // expect(testProps.handleClose).toHaveBeenCalled() //does not work
    expect(modal).not.toBeInTheDocument();
    expect(closeModalButton).not.toBeInTheDocument();
    expect(deleteModalButton).not.toBeInTheDocument();
  });

  test('modal delete button', () => { //works
    setupModal()
    expect(deleteModalButton).toBeInTheDocument()
    userEvent.click(deleteModalButton)
    expect(deleteModalButton).not.toBeInTheDocument()
    expect(modal).not.toBeInTheDocument();
    expect(closeModalButton).not.toBeInTheDocument();
  });
})

xtest('handleModalCloseAndDelete function', () => {

});

xtest('handleClose function', () => {
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  let test = screen.getByTestId('close_button')
  expect(test).toBeInTheDocument()
  userEvent.click(test)
  expect(testProps.handleClose).toHaveBeenCalled()
});

test('handleClear function', () => { //works
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  let clearButton = screen.getByTestId('clear_button')
  let text = screen.getByDisplayValue(/event_form_test/i)
  expect(clearButton).toBeInTheDocument()
  expect(text).toBeInTheDocument()

  userEvent.click(clearButton)
  expect(screen.queryByDisplayValue(/event_form_test/i)).not.toBeInTheDocument()
});

test('handleFieldChange function', () => {
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  let text = screen.getByDisplayValue(/event_form_test/i)
  userEvent.type(text, 'blah')
  let changedText = screen.getByDisplayValue(/blah/i)
  expect(changedText).toBeInTheDocument()
});

xtest('handeDateFieldChange function', async () => { // lol, lmao even
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => ({
      media: query,
      // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
      matches: query === "(pointer: fine)",
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  let datePicker = screen.getByRole('textbox', { name: 'Choose date, selected date is Apr 21, 2023'})
  // let datePicker = screen.getByLabelText('Date').querySelector('input')
  // console.log(screen.debug(screen.getByLabelText('Date').querySelector('input'), Infinity));
  // fireEvent.click(datePicker)
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    // await fireEvent.change(datePicker, {target: {value: "04/15/2023"}})
    await userEvent.clear(datePicker)
    await userEvent.type(datePicker, "04/15/2023")
  })
  // console.log(screen.debug(null, Infinity));
  // userEvent.clear(datePicker)
  // userEvent.type(datePicker, "04/15/2023")
  expect(datePicker).toHaveValue("04/15/2023");
  // fireEvent.change(datePicker, {target: {value: '04/15/2023'}})
  // fireEvent.click(textbox)
  // let selected = screen.getByRole('gridcell', { name: '15' })
  // fireEvent.click(selected)
  // userEvent.
  // let okButton = screen.getByRole('button', {name: 'OK'})
  // fireEvent.click(okButton)
  // expect(textbox).toBeNull()
  const startDateInput  = screen.getByRole('textbox', { name: 'Choose date, selected date is Apr 15, 2023'})
  expect(startDateInput).toBeInTheDocument();
  delete window.matchMedia;
});

xtest('handleStartTimeFieldChange function', () => {

});

xtest('handleEndTimeFieldChange function', () => { // no idea
  // let text = screen.getByDisplayValue(/event_form_test/i)
  createCustomComponent(editReduxState({anchorType: 'Update'}));
  let field = screen.getByRole('textbox', {name: 'Choose time, selected time is 12:30 PM'})
  expect(field).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: 'Choose time, selected time is 1:30 PM'})).not.toBeInTheDocument()
  userEvent.click(field)
  // console.log(screen.debug(null, Infinity));
  let okButton = screen.getByRole('button', {name: 'OK'})
  let hour = screen.getByLabelText('1 hours')
  // userEvent.selectOptions(hour)
  // fireEvent.change(field, {target: {value: {"$d": new Date('2023-03-21 13:30:00')}}})
  fireEvent.click(hour)
  userEvent.click(okButton)
  // console.log(screen.debug(null, Infinity));
  // expect(field).not.toBeInTheDocument()
  // expect(screen.getByRole('textbox', {name: 'Choose time, selected time is 1:30 PM'})).toBeInTheDocument()q
});
// "⁦⁨12⁩:⁨30⁩⁩ ⁦⁨PM⁩⁩"

test('handleEditToggle function', () => { //works
  createCustomComponent(editReduxState({anchorType: 'Update', editing: false}));
  // console.log(screen.debug(null, Infinity));

  let editButton = screen.getByTestId('edit_button')
  let clearButton = screen.getByTestId('clear_button')
  let titleField = screen.getByRole('textbox', {name: 'Title'})
  expect(editButton).toBeInTheDocument()
  expect(clearButton).toBeInTheDocument()
  expect(clearButton).toBeDisabled()
  expect(titleField).toBeInTheDocument()
  expect(titleField).toBeDisabled()

  userEvent.click(editButton)
  expect(titleField).not.toBeDisabled()
});

xtest('handleError function', () => {

});
