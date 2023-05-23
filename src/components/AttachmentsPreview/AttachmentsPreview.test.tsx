import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import AttachmentsPreview from './AttachmentsPreview';

const testProps = {
  attachmentsList: [],
  event_id: 1,
  mode: 'preview',
  editingEnabled: true,
};

test('renders the component', () => {
  renderWithProviders(<AttachmentsPreview {...testProps}/>);
  const dayElement = screen.getByTestId('attachments_preview');
  expect(dayElement).toBeInTheDocument();
});
