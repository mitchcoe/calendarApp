// import logo from './logo.svg';
import { useState, useEffect, useCallback } from 'react';
// import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Day from './components/Day';
import Event from "./components/Event";
/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

export default function App() {
  const [eventsData, setEventsData] = useState([]);
  // console.log(eventsData[0])

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
      .then(response => setEventsData(response))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    getEventsData();
  }, [getEventsData]);

  const defaultEvent = {
    title: 'test_event',
    description: 'testing server and database connection',
    location: 'Austin, TX',
    date: '2024-03-31',
    start_time: '2023-04-18 14:11:00-07',
    end_time: '2023-04-18 15:00:00-07'
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
        setEventsData(eventsData.concat(response.data)); // is this the best way to do this?
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
        event_id: `${eventsData[0].event_id}`,
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

  const deleteEvent = async () => {
    await fetch('/events', {
      method:'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({event_id: `${eventsData[eventsData.length - 1].event_id}`}),
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response.message);
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
      {eventsData.length > 0 ? (
        <Day events={eventsData} />
      ) : null}
      {/* <div css={{
        position: 'absolute',
        transform: 'translateY(-500px) translateX(96px)',
        }}
      >
        <Event event={eventsData} />
      </div> */}
    </Container>
  );
};
