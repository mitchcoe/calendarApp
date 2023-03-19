import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const getEventsData = async () => {
      await fetch('/events')
        .then(response => response.json())
        .then(response => {
          // console.log(response)
          setEventsData(response)
        })
        .catch(error => console.log(error));
    };
    getEventsData();
  }, []);

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
