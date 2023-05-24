import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import ReminderNotification from './ReminderNotification';

const testProps = {
  onClose: jest.fn(),
  message: 'test',
  location: 'test location',
  phone: '12345',
  description: 'test notification',
};

test('renders the component', () => {
  renderWithProviders(<ReminderNotification {...testProps}/>);
  const element = screen.getByTestId('reminder_notification');
  expect(element).toBeInTheDocument();
});

test('expands the notification when the expand icon is clicked on', () => {
  renderWithProviders(<ReminderNotification {...testProps}/>);
  const expandIcon = screen.getByTestId('expandIcon');

  fireEvent.click(expandIcon);
  expect(expandIcon).toHaveStyle('transform: rotate(180deg)');
})