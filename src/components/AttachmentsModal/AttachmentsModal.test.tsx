import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import AttachmentsModal from './AttachmentsModal';

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const testProps = {
  attachmentsModalOpen: true,
  handleAttachmentsModalClose: jest.fn(),
  modalStyles,
  hasAttachments: true,
  event_id: 1
};


test('renders the component', () => {
  renderWithProviders(<AttachmentsModal {...testProps}/>);
  const dayElement = screen.getByTestId('attachments_modal');
  expect(dayElement).toBeInTheDocument();
});