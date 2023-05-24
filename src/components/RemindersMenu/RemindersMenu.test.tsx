import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import renderWithProviders from '../../utils/test_utils';
import RemindersMenu from './RemindersMenu';
// import { useAppSelector, useAppDispatch } from '../../hooks';

export const handlers = [
  rest.get('/reminders/1', (req, res, ctx) => {
    return res(ctx.json({
      reminder_id: 1,
      type: 'email',
      time_before: '0 30 60',
      reminders_on: true,
      event_id: 1
    }), ctx.delay(150))
  }),
  rest.put('/reminders/1', (req, res, ctx) => {
    return res(ctx.json({
      message: 'Reminder with Event ID: 1 updated',
      updated: {
        reminder_id: 1,
        type: 'email',
        time_before: '0 15 30 60',
        reminders_on: false,
        event_id: 1,
      }
    }), ctx.delay(150))
  })
]

const server = setupServer(...handlers);
const anchor = document.createElement('div');

const testProps = {
  open: true,
  anchorEl: anchor,
  onClose: jest.fn(),
  event_id: 1,
  anchorType: 'Update',
};


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the component', () => {
  renderWithProviders(<RemindersMenu {...testProps}/>);
  const dayElement = screen.getByTestId('reminders_menu');
  expect(dayElement).toBeInTheDocument();
});

test('fetches reminder and recieves reminder data when updating an event', async () => {
  renderWithProviders(<RemindersMenu {...testProps}/>);

  let checkbox15 = within(screen.getByTestId('reminder_checkbox_15')).getByRole('checkbox');
  let checkbox30 = within(screen.getByTestId('reminder_checkbox_30')).getByRole('checkbox');
  let checkbox45 = within(screen.getByTestId('reminder_checkbox_45')).getByRole('checkbox');
  let checkbox60 = within(screen.getByTestId('reminder_checkbox_60')).getByRole('checkbox');

  await waitFor(() => expect(checkbox15).not.toBeChecked());
  await waitFor(() => expect(checkbox30).toBeChecked());
  await waitFor(() => expect(checkbox45).not.toBeChecked());
  await waitFor(() => expect(checkbox60).toBeChecked());
});

test('updates reminder data correctly', async () => {
  renderWithProviders(<RemindersMenu {...testProps}/>);

  let remindersToggle = within(screen.getByTestId('reminders_on_toggle')).getByRole('checkbox')
  let checkbox15 = within(screen.getByTestId('reminder_checkbox_15')).getByRole('checkbox');
  let reminderType = within(screen.getByTestId('reminder_type_text')).getByRole('radio');

  await waitFor(() => expect(remindersToggle).toBeChecked());
  await waitFor(() => expect(checkbox15).toBeEnabled());
  await waitFor(() => expect(checkbox15).not.toBeChecked());
  await waitFor(() => expect(reminderType).toBeEnabled());
  await waitFor(() => expect(reminderType).not.toBeChecked());

  fireEvent.click(reminderType);
  fireEvent.click(checkbox15);
  fireEvent.click(remindersToggle);

  await waitFor(() => expect(remindersToggle).not.toBeChecked());
  await waitFor(() => expect(checkbox15).not.toBeEnabled());
  await waitFor(() => expect(checkbox15).toBeChecked());

  await waitFor(() => expect(reminderType).not.toBeEnabled());
  await waitFor(() => expect(reminderType).toBeChecked());
});
