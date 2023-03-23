import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';
import formReducer from './slices/formSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
    form: formReducer,
  }
})

export default store