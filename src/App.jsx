import { useEffect, useCallback } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Day from './components/Day';
import EventsContainer from './components/EventsContainer';
import { useSelector, useDispatch } from 'react-redux'
import { getEvents } from './slices/eventSlice';

export default function App() {
  const events = useSelector((state) => state.events.eventList);
  const dispatch = useDispatch();
  console.log(events)

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

  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

  useEffect(() => {
    getEventsData();
  }, [getEventsData]);

  return (
    <Container sx={containerStyles}>
      <CssBaseline />
      <React.Fragment>
        <Day />
        {events.length > 0 ? (
          <EventsContainer events={events}/>
        ) : null}
      </React.Fragment>
    </Container>
  );
};
