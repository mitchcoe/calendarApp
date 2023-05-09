import { useEffect, useCallback, useMemo } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Popper from '@mui/material/Popper';
// import ClickAwayListener from '@mui/base/ClickAwayListener';
import Day from './components/Day/Day';
import EventsContainer from './components/Event/EventsContainer';
import EventForm from './components/EventForm/EventForm';
import RemindersQueue from './components/RemindersQueue/RemindersQueue';
import { useAppSelector, useAppDispatch } from './hooks'
import { getEvents, getEventsByDay, setSelectedDate } from './slices/eventSlice';
import { toggleEventForm, handleEventChanges, clearEventChanges } from './slices/formSlice'
import { clearReminders } from './slices/reminderSlice'
import type { Event, HandleClickType } from './globalTypes'
// const formUtils = require('./components/EventForm/EventForm');

export default function App() {
  // console.log('im rendering')
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  // const events = useSelector((state) => state.events.eventList);
  const todaysEvents = useAppSelector((state) => state.events.currentEventList);
  const selectedDate = useAppSelector((state) => state.events.selectedDate);
  const open = useAppSelector((state) => state.form.open)
  // const formId = useSelector((state) => state.form.event_id);
  const dispatch = useAppDispatch();
  
  let today = new Date(Date.now()).toISOString();
  if(!selectedDate) dispatch(setSelectedDate(today));
  let newSelectedDate = useMemo(() => new Date(selectedDate?.slice(0, selectedDate.indexOf("Z"))), [selectedDate]);

  const handleClose = (event?: React.MouseEvent) => {
    setAnchorEl(null);
    dispatch(toggleEventForm({open: false}));
    dispatch(clearReminders())
  };

  const handleClick: HandleClickType = (e, event) => {
    // console.log('props', JSON.stringify(props))
    if(open && anchorEl !== e.currentTarget) {
      dispatch(clearEventChanges())
      dispatch(clearReminders())
      setAnchorEl(e.currentTarget);
    } else if(open && anchorEl === e.currentTarget) {
        return handleClose()
    } else if(!open) {
        setAnchorEl(e.currentTarget);
    }

    dispatch(toggleEventForm({
      open: open ? open : !open,
      anchorType: (e.target as HTMLElement).localName === 'td' ? 'Create' : 'Update',
      event_id: (e.target as HTMLElement).localName === 'td' ? null : event?.event_id,
      editing: false,
    }));

    dispatch(handleEventChanges({...event}));
  };

  const id = open ? 'simple-popper' : undefined;

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

  // const getEventsByYearData = useCallback(async () => {
  //   let year = newSelectedDate?.getFullYear()

  //   await fetch(`/events/${year}`)
  //     .then(response => response.json())
  //     .then(response => console.log('get events by year', response))
  //     .catch(error => console.log('ERROR:', error));
  // }, [newSelectedDate]);

  // const getEventsByMonthData = useCallback(async () => {
  //   let year = newSelectedDate?.getFullYear()
  //   let month = newSelectedDate?.getMonth();
  //   await fetch(`/events/${year}/${month + 1}/`)
  //     .then(response => response.json())
  //     .then(response => console.log('get events by month', response))
  //     .catch(error => console.log('ERROR:', error));
  // }, [newSelectedDate]);

  useEffect(() => {
    getEventsData();
    // getAttachments()
    if(selectedDate) getEventsByDayData();
  }, [getEventsData, getEventsByDayData, selectedDate]);

  const containerStyles = {
    textAlign: 'center',
    minHeight: '100vh',
    minWidth: '100%',
    backgroundColor: '#282c34',
  };

  return (
    <Container sx={containerStyles} data-testid="app_container">
      <CssBaseline />
      <React.Fragment>
        <Day handleClick={handleClick} events={todaysEvents} />
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
        <EventForm handleClose={handleClose} />
      </Popper>
      <RemindersQueue events={todaysEvents}/>
    </Container>
  );
};
