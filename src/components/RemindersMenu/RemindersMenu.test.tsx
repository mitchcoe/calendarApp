import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import RemindersMenu from './RemindersMenu';

const anchor = document.createElement('div');

const testProps = {
  open: true,
  anchorEl: anchor,
  onClose: jest.fn(),
  event_id: 1,
  anchorType: 'create',
};

test('renders the component', () => {
  renderWithProviders(<RemindersMenu {...testProps}/>);
  const dayElement = screen.getByTestId('reminders_menu');
  expect(dayElement).toBeInTheDocument();
});
