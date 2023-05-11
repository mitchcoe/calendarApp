import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { SnackbarProvider } from "notistack";
import ReminderNotification from './components/RemindersQueue/ReminderNotification.tsx';
import './index.css';
import App from './App.tsx';
import { setupStore } from './store.ts'
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={setupStore()}>
      <SnackbarProvider
        maxSnack={4}
        Components={{
          reminderNotification: ReminderNotification
        }}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
