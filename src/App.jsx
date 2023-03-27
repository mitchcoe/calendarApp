import { useEffect, useCallback, useMemo } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Popper from '@mui/material/Popper';
// import ClickAwayListener from '@mui/base/ClickAwayListener';
import Day from './components/Day';
import EventsContainer from './components/EventsContainer';
import EventForm from './components/EventForm';
import { useSelector, useDispatch } from 'react-redux'
import { getEvents, getEventsByDay, setSelectedDate } from './slices/eventSlice';
import { toggleEventForm, handleEventChanges, clearEventChanges } from './slices/formSlice'

export default function App() {
  // hooks and useSelector cause re-renders
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const events = useSelector((state) => state.events.eventList);
  const todaysEvents = useSelector((state) => state.events.currentEventList);
  const selectedDate = useSelector((state) => state.events.selectedDate);
  const open = useSelector((state) => state.form.open)
  // const formId = useSelector((state) => state.form.event_id);
  const dispatch = useDispatch();
  
  let today = new Date(Date.now()).toISOString();
  if(!selectedDate) dispatch(setSelectedDate(today));
  let newSelectedDate =  useMemo(() => new Date(selectedDate?.slice(0, selectedDate.indexOf("Z"))), [selectedDate]);

  const handleClose = (event) => {
    setAnchorEl(null);
    dispatch(toggleEventForm({
      open: false,
      anchorType: null,
      event_id: null,
    }));
  };

  const handleClick = (event, props) => {
    // console.log('props', JSON.stringify(props))
    if(props && open) {
      dispatch(clearEventChanges())
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    }
    dispatch(toggleEventForm({
      open: props && open ? open : !open,
      anchorType: event.target.localName === 'td' ? 'Create' : 'Update',
      event_id: event.target.localName === 'td' ? null : props?.event_id
    }))
    if (props) dispatch(handleEventChanges({...props}));
  };
  // const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined;
  // console.log('events rendered in app.jsx', events)
  // console.log("current events today", todaysEvents)

  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

  const getEventsByDayData = useCallback(async () => {
    let year = newSelectedDate?.getFullYear()
    let month = newSelectedDate?.getMonth();
    let day = newSelectedDate?.getDate();

    await fetch(`/events/${year}/${month + 1}/${day}`)
      .then(response => response.json())
      .then(response => dispatch(getEventsByDay(response)))
      .catch(error => console.log('ERROR:', error));
  }, [dispatch, newSelectedDate]);

  useEffect(() => {
    getEventsData();
    if(selectedDate) getEventsByDayData();
  }, [getEventsData, getEventsByDayData, selectedDate]); // adding todaysEvents causes infinite loop

  const containerStyles = {
    textAlign: 'center',
    minHeight: '100vh',
    minWidth: '100%',
    backgroundColor: '#282c34',
  };

  return (
    <Container sx={containerStyles}>
      <CssBaseline />
      <React.Fragment>
        <Day handleClick={handleClick} anchorEl={anchorEl} />
        {todaysEvents?.length > 0 ? (
          <EventsContainer
            events={todaysEvents}
            handleClick={handleClick}
          />
        ) : null}
      </React.Fragment>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{zIndex: 100}}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
      >
        <EventForm handleClick={handleClick} handleClose={handleClose} />
      </Popper>
    </Container>
  );
};
