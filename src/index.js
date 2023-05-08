import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { SnackbarProvider } from "notistack";
import ReminderNotification from './components/RemindersQueue/ReminderNotification';
import './index.css';
import App from './App';
import { setupStore } from './store'
import reportWebVitals from './reportWebVitals';

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
