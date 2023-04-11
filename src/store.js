import { configureStore, combineReducers } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';
import formReducer from './slices/formSlice';
import reminderReducer from './slices/reminderSlice';

// https://redux.js.org/usage/writing-tests
const rootReducer = combineReducers({
  events: eventsReducer,
  form: formReducer,
  reminder: reminderReducer,
});

const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export default setupStore