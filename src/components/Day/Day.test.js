import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from '../../utils/test_utils'
import Day from './Day';

let date = new Date();
date.setUTCHours(13,0,0);
let formattedDate = date;
formattedDate = date.toISOString();
formattedDate = formattedDate.slice(0, formattedDate.lastIndexOf('.')) + '.000Z'

let hours = date.getUTCHours()
// console.log(hours)

let endTime = new Date();
endTime.setUTCHours(hours + 1, 0, 0)
endTime = endTime.toISOString()
endTime = endTime.slice(0, endTime.lastIndexOf('.')) + '.000Z'
// console.log('formattedDate',formattedDate)
// console.log('endTime',endTime)
// console.log('date', date)

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

// test('should change the date correctly', async () => {
//   renderWithProviders(<Day />, {
//     preloadedState: {
//       events: {
//         selectedDate: formattedDate
//       }
//     }
//   });
//   let textbox = screen.getByRole('button', { name: 'Choose date, selected date is Mar 30, 2023'})
//   // console.log(textbox)
//   fireEvent.click(textbox)
//   screen.debug(textbox)
//   let datepickerElement = screen.getByRole('button', { name: '15' })
//   // console.log(datepickerElement)
//   fireEvent.click(datepickerElement)
//   let handleDateChange = jest.fn(() => {
//     return "03 / 31 / 2023"
//   })
//   // let yesterday = date;
//   // yesterday.setDate(15)
//   // await fireEvent.change(datepickerElement, {target: {value: {"$d": date}}})
//   const startDateInput = (await screen.findByLabelText("Start Date"))
//   expect(startDateInput.value).toBe('03 / 15 / 2023')
// })

test('should pass the correctly formatted times when clicking an empty cell', () => {
  const handleClick = jest.fn();
  renderWithProviders(<Day handleClick={handleClick}/>, {
    preloadedState: {
      events: {
        selectedDate: formattedDate
      }
    }
  });
  const tableElements = screen.getAllByTestId('empty_cell')
  fireEvent.click(tableElements[0])
  expect(tableElements).toHaveLength(10)
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick.mock.calls[0][1]).toEqual({date: formattedDate, end_time: endTime, start_time: formattedDate })
});
