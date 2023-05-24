import { screen, fireEvent, act } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Day from './Day';

// const defaultEvent = {
//   title: 'event_form_test',
//   description: 'testing event creation on the front end',
//   location: 'Austin, TX',
//   date: '2023-04-21',
//   start_time: `2023-04-21 09:30:00`,
//   end_time: `2023-04-21 12:30:00`
// };
let date = new Date();
let YYYYMMDD = date.toISOString().split('T')[0];

const defaultEvent = {
  title: 'event_form_test',
  description: 'testing event creation on the front end',
  location: 'Austin, TX',
  date: YYYYMMDD,
  start_time: `${YYYYMMDD} 09:30:00`,
  end_time: `${YYYYMMDD} 12:30:00`
};

date.setUTCHours(13,0,0);

let formattedDate = date.toISOString();
formattedDate = formattedDate.slice(0, formattedDate.lastIndexOf('.')) + '.000Z';

let hours = date.getUTCHours();
let endTime = new Date();
endTime.setUTCHours(hours + 1, 0, 0);
let formattedEndTime = endTime.toISOString();
formattedEndTime = formattedEndTime.slice(0, formattedEndTime.lastIndexOf('.')) + '.000Z';

const dateFormatter = (day: string) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format( new Date(day.slice(0, day.indexOf("Z"))))
};

const formattedTime = dateFormatter(formattedDate);


const testProps = {
  events: [],
  handleClick: jest.fn()
};

test('renders the component', () => {
  renderWithProviders(<Day {...testProps}/>);
  const dayElement = screen.getByText(/8AM/i);
  expect(dayElement).toBeInTheDocument();
});

test('should render 10 table rows', () => {
  renderWithProviders(<Day {...testProps}/>);
  const tableElements = screen.getAllByTestId('empty_cell');
  expect(tableElements).toHaveLength(10);
});

test('renders the selected date in a long format', () => {
  renderWithProviders(<Day {...testProps}/>, {
    preloadedState: {
      events: {
        eventList: [],
        currentEventList: [],
        selectedDate: formattedDate
      }
    }
  });
  let timeElement = screen.getByText(formattedTime);
  expect(timeElement).toBeInTheDocument();
});

test('should change the date correctly', async () => {
  renderWithProviders(<Day {...testProps}/>, {
    preloadedState: {
      events: {
        eventList: [],
        currentEventList: [],
        selectedDate: formattedDate
      }
    }
  });
  let dateValues = date.toDateString().split(' ');
  let textbox = screen.getByRole('button', { name: `Choose date, selected date is ${dateValues[1]} ${dateValues[2]}, ${dateValues[3]}`});
  fireEvent.click(textbox);
  let datepickerElement = screen.getByRole('gridcell', { name: '15' });
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    fireEvent.click(datepickerElement)
  });

  let pickedDate = new Date();
  pickedDate.setDate(15)
  let dateStr = dateFormatter(pickedDate.toISOString());
  const startDateInput  = screen.getByText(dateStr);

  expect(startDateInput).toBeInTheDocument();
});

test('should pass the correctly formatted times when clicking an empty cell', () => {
  const { handleClick } = testProps;
  renderWithProviders(<Day {...testProps}/>, {
    preloadedState: {
      events: {
        eventList: [],
        currentEventList: [],
        selectedDate: formattedDate
      }
    }
  });
  let dateValues = date.toDateString().split(' ');
  let numericMonth = date.getUTCMonth() + 1;
  const tableElements = screen.getAllByTestId('empty_cell');
  fireEvent.click(tableElements[0]);
  expect(tableElements).toHaveLength(10);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick.mock.calls[0][1]).toEqual({
    date: formattedDate,
    end_time: formattedEndTime,
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

test('should block times correctly', () => {
  date.setUTCHours(13, 0, 0);
  let startTime = date.toISOString();
  startTime = startTime.slice(0, startTime.lastIndexOf('.')).split('T').join(' ');

  date.setUTCHours(14, 0, 0);
  let endTime = date.toISOString();
  endTime = endTime.slice(0, endTime.lastIndexOf('.')).split('T').join(' ');

  const handleClick = jest.fn();
  let morningEvent = Object.assign({}, {...defaultEvent, start_time: startTime, end_time: endTime});

  renderWithProviders(<Day handleClick={handleClick} events={[morningEvent, defaultEvent]}/>, {
    preloadedState: {
      events: {
        eventList: [morningEvent, defaultEvent],
        currentEventList: [morningEvent, defaultEvent],
        selectedDate: formattedDate
      }
    }
  });
  
  const tableElements = screen.getAllByTestId('empty_cell');
  fireEvent.click(tableElements[1]);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick.mock.calls[0][1]).toEqual({
    date: formattedDate,
    start_time: `${YYYYMMDD}T14:00:00.000Z`,
    end_time: `${YYYYMMDD}T14:30:00.000Z`,
  });
});

test('changes the day by one correctly', () => {
  renderWithProviders(<Day {...testProps}/>, {
    preloadedState: {
      events: {
        eventList: [],
        currentEventList: [],
        selectedDate: formattedDate
      }
    }
  });

  let dayOfTheMonth = date.getDate();
  let incrementButton = screen.getByTestId('increment_day');
  let decrementButton = screen.getByTestId('decrement_day');
  
  let tomorrow = new Date();
  let yesterday = new Date();
  
  tomorrow.setDate(dayOfTheMonth + 1);
  yesterday.setDate(dayOfTheMonth - 1);
  
  const formattedTomorrow = dateFormatter(tomorrow.toISOString());
  const formattedYesterday = dateFormatter(yesterday.toISOString());
  
  fireEvent.click(incrementButton);

  let targetElement  = screen.getByText(formattedTomorrow);
  expect(targetElement).toBeInTheDocument();

  fireEvent.click(decrementButton);
  fireEvent.click(decrementButton);

  targetElement = screen.getByText(formattedYesterday);
  expect(targetElement).toBeInTheDocument();
});
