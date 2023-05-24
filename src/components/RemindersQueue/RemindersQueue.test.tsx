import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import renderWithProviders from '../../utils/test_utils';
import RemindersQueue from './RemindersQueue';

export const handlers = [
  rest.get('/reminders/today', (req, res, ctx) => {
    return res(ctx.json({
      reminder_id: 1,
      type: 'text',
      time_before: '0 30 60',
      reminders_on: true,
      event_id: 1,
    }), ctx.delay(150))
  })
];

const defaultEvent = {
  event_id: 1,
  title: 'event_form_test',
  description: 'testing event creation on the front end',
  location: 'Austin, TX',
  phone: '12345',
  date: '2023-04-21',
  start_time: '2023-04-21 09:45:00',
  end_time: '2023-04-21 12:30:00',
  color: '#2196f3',
  hasAttachments: false,
  hasReminders: true,
  attachmentsList: [],
  attachmentPreviews: [],
};

const testProps= {
  events: [defaultEvent]
};

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the component', async () => {
  renderWithProviders(<RemindersQueue {...testProps}/>);
  const element = screen.getByTestId('reminders_queue');
  await waitFor(() => expect(element).toBeInTheDocument());
});