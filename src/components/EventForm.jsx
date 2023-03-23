import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {MobileDatePicker, MobileTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  ButtonGroup,
  TextField,
  IconButton,
  CardHeader,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { getEvents, createEvents, updateEvents, deleteEvents } from '../slices/eventSlice';
import { clearEventChanges, handleEventChanges } from '../slices/formSlice';

export default function EventForm(props) {
  const events = useSelector((state) => state.events.eventList);
  const { title, description, location, phone, date, start_time, end_time, anchorType } = useSelector((state) => state.form)
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const defaultEvent = {
    title: 'event_placing_test',
    description: 'testing event creation on the front end',
    location: 'Austin, TX',
    date: '2023-03-21',
    start_time: '2023-03-21 09:45:00',
    end_time: '2023-03-21 12:30:00'
  };

  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

  const createEvent = async () => {
    await fetch('/events', {
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title, description, location, phone, date, start_time, end_time}),
    })
      .then(response => response.json())
      .then(response => {
        dispatch(createEvents(response.data));
      })
      .catch(error => console.log(error));
  };

  const updateEvent = async () => {
    await fetch('/events', {
      method:'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_id: `${events[0].event_id}`, //this needs to be the selected event id
        title: 'update test',
        location: 'timbuktu'
      }),
    })
    .then(response => response.json())
    .then(response => {
      // console.log('updated event data response',response);
      dispatch(updateEvents(response.updated))
    })
    .catch(error => console.log(error));
  };

  const deleteEvent = async () => { // this needs to target the selected event
    await fetch('/events', {
      method:'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({event_id: `${events[events.length - 1].event_id}`}),
    })
      .then(response => response.json())
      .then(response => {
        dispatch(deleteEvents(response.id));
        getEventsData();
      })
      .catch(error => console.log(error));
  };

  const {handleClick} = props

  const handleSubmit = async (event) => {
    await createEvent();
    handleClick(event);
  }

  const handleClear = () => {
    dispatch(clearEventChanges())
  }

  const handleFieldChange = (event) => {
    dispatch(handleEventChanges({[event.target.id]: event.target.value}))
  }

  const handeDateFieldChange = (event) => {
    dispatch(handleEventChanges({date: `${event['$y']}-0${event['$M']+ 1}-${event['$D']}`}))
  }

  const handleStartTimeFieldChange = (event) => {
    dispatch(handleEventChanges({start_time: `${date} ${event['$H'] < 12 ? `0${event['$H']}` : event['$H']}:${event['$m'] === 0 ? `0${event['$m']}` : event['$m']}:00`}))
  }

  const handleEndTimeFieldChange = (event) => {
    dispatch(handleEventChanges({end_time: `${date} ${event['$H'] < 12 ? `0${event['$H']}` : event['$H']}:${event['$m'] === 0 ? `0${event['$m']}` : event['$m']}:00`}))
  }

  const cardHeaderStyles = {
    display: 'flex',
    backgroundColor: 'red'
  };
  const cardContentStyles = {
    display: 'flex',
    flexDirection: 'column',
  }
  const buttonContainerStyles = { 
    display: 'flex',
    justifyContent: 'space-evenly',
  };
  const iconButtonStyles = {
    ml: '16px'
  }
  // eslint-disable-next-line no-unused-vars
  const submitButtonStyles = {
    // backgroundColor
  }
  const fieldStyles = {
    mb: '16px'
  }

  return(
    <Box component="form" autoComplete="off" sx={{width: '25vw'}}>
      <Card>
        <CardHeader
          sx={cardHeaderStyles}
          title={
            <Typography>
              {anchorType} Event
            </Typography>
          }
          action={
            <ButtonGroup id="app_bar" sx={buttonContainerStyles}>
              <IconButton sx={iconButtonStyles} onClick={updateEvent}>
                <EditIcon />
              </IconButton>
              <IconButton sx={iconButtonStyles} onClick={deleteEvent}>
                <DeleteIcon />
              </IconButton>
              <IconButton sx={iconButtonStyles} onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            </ButtonGroup>
          }
        />
        <CardContent sx={cardContentStyles}>
          <TextField
            id="title"
            label="Title"
            sx={fieldStyles}
            value={title}
            onChange={handleFieldChange}
          />
          <TextField
            id="description"
            label="Description"
            sx={fieldStyles}
            value={description}
            onChange={handleFieldChange}
          />
          <TextField
            id="location"
            label="Location"
            sx={fieldStyles}
            value={location}
            onChange={handleFieldChange}
          />
          <TextField
            id="phone"
            label="Phone #"
            sx={fieldStyles}
            value={phone}
            onChange={handleFieldChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              controlled
              id="date"
              disablePast
              sx={fieldStyles}
              // value={date} dayjs does not like this for some reason
              onChange={handeDateFieldChange}
            />
            <MobileTimePicker
              id="start_time"
              label="Start Time"
              sx={fieldStyles}
              // value={start_time} // maybe do a custom hook to update new value in the future
              onChange={handleStartTimeFieldChange}
            />
            <MobileTimePicker
              id="end_time"
              label="End Time"
              sx={fieldStyles}
              // value={end_time}
              onChange={handleEndTimeFieldChange}
            />
          </LocalizationProvider>
        </CardContent>
        <CardActions id="submit_buttons" sx={buttonContainerStyles}>
          <Button id="submit" variant="outlined" onClick={handleSubmit}>
            Create
          </Button>
          <Button id="clear" variant="outlined" color="primary" onClick={handleClear}>
            Clear
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
};
