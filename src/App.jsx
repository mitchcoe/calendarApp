import { useState, useEffect, useCallback } from 'react';
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Day from './components/Day';
import EventsContainer from './components/EventsContainer';
import { useSelector, useDispatch } from 'react-redux'
import { getEvents, createEvents, updateEvents, deleteEvents } from './slices/eventSlice';
/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

export default function App() {
  const events = useSelector((state) => state.events.eventList);
  const dispatch = useDispatch();
  // console.log(events)

  const containerStyles = {
    textAlign: 'center',
    minHeight: '100vh',
    minWidth: '100%',
    backgroundColor: '#282c34',
  };

  const headerStyles = {
    backgroundColor: '#282c34',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  }

  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

  useEffect(() => {
    getEventsData();
  }, [getEventsData]);

  const defaultEvent = {
    title: 'event_placing_test',
    description: 'testing event creation on the front end',
    location: 'Austin, TX',
    date: '2023-03-21',
    start_time: '2023-03-21 09:45:00',
    end_time: '2023-03-21 12:30:00'
  };

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
      // console.log(response.message);
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
      body: JSON.stringify({event_id: `${events[events.length - 1].event_id}`}),
    })
      .then(response => response.json())
      .then(response => {
        let id = parseInt(response.message.slice(-3))
        dispatch(deleteEvents(id));
        getEventsData();
      })
      .catch(error => console.log(error));
  };

  return (
    <Container sx={containerStyles}>
      <CssBaseline />
      <div css={headerStyles}>
        <button onClick={createEvent}>
          Create Default Event Test
        </button>
        <button onClick={deleteEvent}>
          Delete Default Event Test
        </button>
        <button onClick={updateEvent}>
          Update Default Event Test
        </button>
      </div>
      <React.Fragment>
        <Day />
        {events.length > 0 ? (
          <EventsContainer events={events}/>
        ) : null}
      </React.Fragment>
    </Container>
  );
};
