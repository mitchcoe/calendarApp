import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
  }
})

export default store