import { screen } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils';
import CustomTimePicker from './CustomTimePicker';

const testProps = {
  events: [],
  timeType: "start_time" as "start_time",
  timeTypeValueState: '',
  timeTypeValueRedux: '',
  onChangeFunc: jest.fn(),
};

xtest('renders the component', () => { // needs localization provider
  renderWithProviders(<CustomTimePicker {...testProps}/>);
  const element = screen.getByTestId('timepicker');
  expect(element).toBeInTheDocument();
});