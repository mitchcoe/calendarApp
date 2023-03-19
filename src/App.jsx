import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const getEventsData = async () => {
      await fetch('/events')
        .then(response => response.json())
        .then(response => setEventsData(response))
        .catch(error => console.log(error));
    };
    getEventsData();
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={createEvent}>
        Create Default Event Test
      </button>
      {eventsData.length > 0 ? (
        <ul>
          {eventsData.map((item, key) => (
            <li key={item.event_id}>
              {JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
