import { useEffect, useCallback } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Popper from '@mui/material/Popper';
import Day from './components/Day';
import EventsContainer from './components/EventsContainer';
import EventForm from './components/EventForm';
import { useSelector, useDispatch } from 'react-redux'
import { getEvents } from './slices/eventSlice';
import { toggleEventForm, handleEventChanges } from './slices/formSlice'

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const events = useSelector((state) => state.events.eventList);
  const open = useSelector((state) => state.form.open)
  // const formId = useSelector((state) => state.form.event_id);
  const dispatch = useDispatch();
  const handleClick =  (event, props) => { //this make things re-render every click
    // console.log(Object.values(event.currentTarget))
    // console.log(props)
    setAnchorEl(anchorEl ? null : event.currentTarget); //this doesnt compare anchorEls
    dispatch(toggleEventForm({
      open: !open,
      anchorType: event.target.localName === 'td' ? 'Create' : 'Update',
      event_id: event.target.localName === 'td' ? null : event?.event_id || props?.event_id
    }))
    if (props) dispatch(handleEventChanges({...props}));
  };
  const id = open ? 'simple-popper' : undefined;
  // console.log('events rendered in app.jsx', events)

  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

  useEffect(() => {
    getEventsData();
  }, [getEventsData]);

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
        {events?.length > 0 ? (
          <EventsContainer
            events={events}
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
        <EventForm handleClick={handleClick}/>
      </Popper>
    </Container>
  );
};
