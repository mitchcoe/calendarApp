import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import ColorPicker from './ColorPicker';

const anchor = document.createElement('div');

const testProps = {
  open: true,
  onClose: jest.fn(),
  id: 'colorPicker',
  anchorEl: anchor,
  dispatchFunction: jest.fn(),
  colorProp: '#2196f3'
};

test('renders the component', () => {
  renderWithProviders(<ColorPicker {...testProps}/>);
  const dayElement = screen.getByTestId('colorpicker');
  expect(dayElement).toBeInTheDocument();
});
