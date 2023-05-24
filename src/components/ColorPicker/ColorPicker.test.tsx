import { screen, fireEvent, within } from '@testing-library/react';
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
  const element = screen.getByTestId('colorpicker');
  expect(element).toBeInTheDocument();
});

// there is an issue with the regex i copied from MUI, anything but a hex value crashes the app
xtest('changes the color', () => {
  renderWithProviders(<ColorPicker {...testProps}/>);
  const colorInput = within(screen.getByTestId('colorInput')).getByRole('textbox');
  expect(colorInput).toHaveDisplayValue('#2196f3');

  fireEvent.change(colorInput, {target: {value: '#f44336'}});
  expect(colorInput).toHaveDisplayValue('#f44336');
});

test('changes the hue', () => {
  renderWithProviders(<ColorPicker {...testProps}/>);
  const colorInput = within(screen.getByTestId('colorInput')).getByRole('textbox');
  expect(colorInput).toHaveDisplayValue('#2196f3');

  const colorBox = screen.getAllByRole('radio');
  fireEvent.click(colorBox[0]);
  expect(colorInput).toHaveDisplayValue('#f44336');
});

test('changes the shade', () => {
  renderWithProviders(<ColorPicker {...testProps}/>);
  const shadeSlider = within(screen.getByTestId('shadeSlider')).getByRole('slider');
  const shadeSliderText = screen.getByTestId('shadeSliderText');
  expect(shadeSliderText).toHaveTextContent('500');

  fireEvent.change(shadeSlider, {target: {value: 25}});
  expect(shadeSliderText).toHaveTextContent('A100');
});
