import { useEffect, useCallback } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Day from './components/Day';
import EventsContainer from './components/EventsContainer';
import { useSelector, useDispatch } from 'react-redux'
import { getEvents } from './slices/eventSlice';
import { toggleEventForm } from './slices/formSlice'

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const events = useSelector((state) => state.events.eventList);
  const open = useSelector((state) => state.form.open)
  const dispatch = useDispatch();
  const handleClick =  (event) => { //this make things re-render every click
    setAnchorEl(anchorEl ? null : event.currentTarget); //this doesnt compare anchorEls
    dispatch(toggleEventForm({open: !open, anchorType: event.target.localName === 'td' ? 'Create' : 'Update' }))
  };
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

  // const headerStyles = {
  //   backgroundColor: '#282c34',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   fontSize: 'calc(10px + 2vmin)',
  //   color: 'white',
  // }


  return (
    <Container sx={containerStyles}>
      <CssBaseline />
      <React.Fragment>
        <Day handleClick={handleClick} anchorEl={anchorEl} />
        {events.length > 0 ? (
          <EventsContainer
            events={events}
            handleClick={handleClick}
            anchorEl={anchorEl}
          />
        ) : null}
      </React.Fragment>
    </Container>
  );
};
