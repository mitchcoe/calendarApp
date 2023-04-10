import { screen, fireEvent, act } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Day from './Day';

let date = new Date();
date.setUTCHours(13,0,0);
let formattedDate = date;

formattedDate = date.toISOString();
formattedDate = formattedDate.slice(0, formattedDate.lastIndexOf('.')) + '.000Z'

let hours = date.getUTCHours()
let endTime = new Date();
endTime.setUTCHours(hours + 1, 0, 0)
endTime = endTime.toISOString()
endTime = endTime.slice(0, endTime.lastIndexOf('.')) + '.000Z'

const formattedTime = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}).format( new Date(formattedDate.slice(0, formattedDate.indexOf("Z"))))

test('renders the component', () => {
  renderWithProviders(<Day />);
  const dayElement = screen.getByText(/8AM/i);
  expect(dayElement).toBeInTheDocument();
});

test('should render 10 table rows', () => {
  renderWithProviders(<Day />);
  const tableElements = screen.getAllByTestId('empty_cell');
  expect(tableElements).toHaveLength(10);
})

test('renders the selected date in a long format', () => {
  renderWithProviders(<Day />, {
    preloadedState: {
      events: {
        selectedDate: formattedDate
      }
    }
  });
  let timeElement = screen.getByText(formattedTime);
  expect(timeElement).toBeInTheDocument();
});

test('should change the date correctly', async () => {
  renderWithProviders(<Day />, {
    preloadedState: {
      events: {
        selectedDate: formattedDate
      }
    }
  });
  let dateValues = date.toDateString().split(' ')
  let textbox = screen.getByRole('button', { name: `Choose date, selected date is ${dateValues[1]} ${dateValues[2]}, ${dateValues[3]}`})
  fireEvent.click(textbox)
  let datepickerElement = screen.getByRole('gridcell', { name: '15' })
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    fireEvent.click(datepickerElement)
  });

  const dateFormatter = (day) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format( new Date(day.slice(0, day.indexOf("Z"))))
  };

  let pickedDate = new Date();
  pickedDate.setDate(15)
  let dateStr = dateFormatter(pickedDate.toISOString())
  const startDateInput  = screen.getByText(dateStr)

  expect(startDateInput).toBeInTheDocument();
})

test('should pass the correctly formatted times when clicking an empty cell', () => {
  const handleClick = jest.fn();
  renderWithProviders(<Day handleClick={handleClick}/>, {
    preloadedState: {
      events: {
        selectedDate: formattedDate
      }
    }
  });
  let dateValues = date.toDateString().split(' ')
  let numericMonth = date.getUTCMonth() + 1
  const tableElements = screen.getAllByTestId('empty_cell');
  fireEvent.click(tableElements[0]);
  expect(tableElements).toHaveLength(10);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick.mock.calls[0][1]).toEqual({
    date: formattedDate,
    end_time: endTime,
    start_time: formattedDate
  });
  fireEvent.click(tableElements[5]);
  expect(handleClick).toHaveBeenCalledTimes(2);
  expect(handleClick.mock.calls[1][1]).toEqual({
    date: formattedDate,
    end_time: `${dateValues[3]}-0${numericMonth}-${dateValues[2]}T19:00:00.000Z`,
    start_time: `${dateValues[3]}-0${numericMonth}-${dateValues[2]}T18:00:00.000Z`
  });
});
