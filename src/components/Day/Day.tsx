import { useState } from 'react'
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import '../../App.css';
import type { EventType, HandleClickType } from '../../globalTypes'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setSelectedDate } from '../../slices/eventSlice';
import dayjs from 'dayjs';
// import { openReminderNotification } from '../../slices/reminderSlice'

const datePickerSlotProps = {
  inputAdornment: {
    sx: {
      '&:hover button': {
        color: 'rgba(255, 255, 255, 0.87)',
      },
      button: {
        color: 'rgba(255, 255, 255, 0.23)',
      },
    }
  },
  field: {
    sx: {
      borderColor: 'white',
    }
  },
  textField: {
    inputProps: {
      sx: {
        input: {
          borderColor: 'white'
        },
        color: 'white',
      }
    },
   sx: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
   },
  },
};

  const hourMinuteFormat = (position: Date) => { // not great readability
  return parseInt(`${position.getHours()}${position.getMinutes() === 0 ?
    '00' : (position.getMinutes() < 10 ? 
      `0${position.getMinutes()}` : position.getMinutes())}`)
};

const blockedTimeSplit = (blockedTime: number) => `${blockedTime}`.length === 3 ? // also not great readability
  [`${blockedTime}`.slice(0, 1),`${blockedTime}`.slice(1)] : [`${blockedTime}`.slice(0, 2),`${blockedTime}`.slice(2)];

// type HandleClickObject = {
//   date: string,
//   start_time: string,
//   end_time: string,
// }
type DayProps = {
  handleClick: HandleClickType,
  events: EventType[],
}

export default function Day(props: DayProps) {
  const { handleClick, events } = props;
  const dispatch = useAppDispatch();
  const [datePickerValue, setDatePickerValue] = useState<object | null>(null);
  let today = useAppSelector((state) => state.events.selectedDate);
  const times = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];

  const blockingEventsCheck = (events: EventType[], time: Date, type: string): string => {
    let formattedTime = hourMinuteFormat(time);

    let timesToCheck = events.map((event: EventType) => {
      let startOrEnd = new Date(event[`${type === 'start' ? 'end' : 'start'}_time`])
      return hourMinuteFormat(startOrEnd)
    });

    let isoStringSplit = (timesToCheck: number[]) => {
      if(timesToCheck.length > 0) {
        let blockedTime = timesToCheck[0];
        let split = blockedTimeSplit(blockedTime)
        split[0] = `${parseInt(split[0]) + 5}`
        return `${time.toISOString().split('T')[0]}T${split[0]}:${split[1]}:00.000Z`
      } else {
        return time.toISOString();
      }
    }

    if(type === 'start') {
      timesToCheck = timesToCheck.filter((endTime) => {
        return endTime > formattedTime && endTime <= formattedTime + 30
      });
      return isoStringSplit(timesToCheck);
    } else {
      timesToCheck = timesToCheck.filter((startTime) => {
        return startTime <= formattedTime && startTime >= formattedTime - 70
      });
      return isoStringSplit(timesToCheck);
    }
  };

  const insertTimeProp = (time: string, date: string, type: string) => {
    let hour = parseInt(time.slice(0, time.indexOf('M') - 1));
    hour = hour < 8 ? hour+= 12 : hour;
    hour+= 5; // timezone stuff, this works for now (US central time), should probably be an .env variable
    if(type === 'end') hour+= 1
    let splitDate = date.split('T');
    splitDate[1] = `${hour}:00:00.000Z`;
    return blockingEventsCheck(events, new Date(splitDate.join('T')), type);
  }

  const dateFormatter = (day: string) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format( new Date(day.slice(0, day.indexOf("Z"))))
  };

  const monthDayYear = (val: {[key: string]: any}) => {
    return val['$d'].toISOString()
  };

  const handleDateChange = async (e: null | React.ChangeEvent<HTMLInputElement>, date: object) => {
    await dispatch(setSelectedDate(monthDayYear(date)));
    setDatePickerValue(date)
  };

  const handleChangeDayByOne = (date: string, direction: string ) => {
    let newDay = new Date(`${date}`)
    let day = newDay.getUTCDate()
    newDay.setUTCDate(direction === 'plus' ? day + 1 : day - 1 )

    handleDateChange(null, dayjs(newDay))
  };

  // const handleIncrement = () => { // helps test notifications queue
  //   let minArray = ['0', '30', '60']
  //   let reminder = {
  //     event_id: 1,
  //     minutes: minArray[count]
  //   }
  //   dispatch(openReminderNotification(reminder))
  //   setCount(count += 1)
  // }

  return(
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 'unset',
        boxShadow: 'unset',
      }}
    >
      <Table className="App-header" sx={{borderCollapse: 'unset'}}>
        <TableHead sx={{textAlign: 'center'}}> 
          <TableRow>
            <TableCell />
            <TableCell scope="row" align="center">
              <Typography color="white">
                {dateFormatter(today)}
              </Typography>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <IconButton onClick={() => handleChangeDayByOne(today, 'minus')}>
                  <ChevronLeftIcon sx={{color: 'white'}}/>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    // @ts-ignore
                    slotProps={datePickerSlotProps}
                    // @ts-ignore
                    value={datePickerValue || dayjs(new Date(today))}
                    onChange={handleDateChange}
                  /> 
                </LocalizationProvider>
                <IconButton onClick={() => handleChangeDayByOne(today, 'plus')}>
                  <ChevronRightIcon sx={{color: 'white'}}/>
                </IconButton>
                {/* <IconButton onClick={() => handleIncrement()}>
                  <ChevronRightIcon sx={{color: 'white'}}/>
                </IconButton> */}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {times.map((time, index) => (
            <TableRow key={time}>
              <TableCell align="center" sx={{borderRight: 'solid', width: '5rem'}}>
                <Typography color="white">
                  {times[index]}
                </Typography>
              </TableCell>
              <TableCell
                data-testid="empty_cell"
                aria-describedby={time}
                sx={{
                  height: '80px',
                  display: 'flex',
                  width: '100%',
                  padding: '16px',
                }}
                onClick={(e) => handleClick(e, {
                  date: today,
                  start_time: insertTimeProp(time, today, 'start'),
                  end_time: insertTimeProp(time, today, 'end'),
                })}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
