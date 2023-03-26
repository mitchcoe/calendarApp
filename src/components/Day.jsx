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
import '../App.css';
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedDate } from '../slices/eventSlice';
import dayjs from 'dayjs';

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

export default function Day(props) {
  const { handleClick } = props;
  const dispatch = useDispatch();
  const [datePickerValue, setDatePickerValue] = useState(null)
  let today = useSelector((state) => state.events.selectedDate);
  // const open = useSelector((state) => state.form.open)
  // const id = open ? 'simple-popper' : undefined;
  const times = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];

  const dateFormatter = (day) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format( new Date(day.slice(0, day.indexOf("Z"))))
  };

  const monthDayYear = (val) => {
    // console.log('monthdayyear', val['$d'].toISOString()) // this is shorter but sets a time with the date
    return new Date(`${val['$y']}-0${val['$M']+ 1}-${val['$D']}`).toISOString()
  };

  const handleDateChange = async (date) => {
    await dispatch(setSelectedDate(monthDayYear(date)));
    setDatePickerValue(date)
  }

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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={datePickerSlotProps}
                  value={datePickerValue ? datePickerValue : dayjs(new Date(today))}
                  onChange={handleDateChange}
                /> 
              </LocalizationProvider>
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
                // aria-describedby={id}
                sx={{
                  height: '80px',
                  display: 'flex',
                  width: '100%',
                  padding: '16px',
                }}
                onClick={handleClick}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
