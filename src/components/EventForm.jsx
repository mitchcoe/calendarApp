import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {MobileDatePicker, TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
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

export default function EventForm(props) {
  const events = useSelector((state) => state.events.eventList);
  const dispatch = useDispatch();

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
      body: JSON.stringify(defaultEvent),
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response.message, response.data);
        dispatch(createEvents(response.data));
      })
      .catch(error => console.log(error));
  };

  //this works but puts the updated event last in the state array
  const updateEvent = async () => {
    await fetch('/events', {
      method:'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_id: `${events[0].event_id}`,
        title: 'update test',
        location: 'timbuktu'
      }),
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      // dispatch(updateEvents(response.updated))
      getEventsData();
    })
    .catch(error => console.log(error));
  };

  const deleteEvent = async () => { // this will target specific ID's later
    await fetch('/events', {
      method:'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({event_id: `${events[events.length - 1].event_id}`}), // needs to target specific id
    })
      .then(response => response.json())
      .then(response => {
        dispatch(deleteEvents(response.id));
        getEventsData();
      })
      .catch(error => console.log(error));
  };

  const {handleClick} = props

const handleSubmit = () => {
  createEvent();
  handleClick();
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
              Create Event
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
          />
          <TextField
            id="description"
            label="Description"
            sx={fieldStyles}
          />
          <TextField
            id="location"
            label="Location"
            sx={fieldStyles}
          />
          <TextField
            id="phone"
            label="Phone #"
            sx={fieldStyles}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              id="date"
              // defaultValue="2023-03-22"
              sx={fieldStyles}
            />
            <TimePicker
              id="start_time"
              label="Start Time"
              sx={fieldStyles}
            />
            <TimePicker
              id="end_time"
              label="End Time"
              sx={fieldStyles}
            />
          </LocalizationProvider>
        </CardContent>
        <CardActions id="submit_buttons" sx={buttonContainerStyles}>
          <Button id="submit" variant="outlined" onClick={handleSubmit}>
            Create
          </Button>
          <Button id="clear" variant="outlined" color="primary">
            Clear
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
};
