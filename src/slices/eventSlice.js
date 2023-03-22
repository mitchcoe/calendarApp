import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    eventList: [],
  },
  reducers: {
    getEvents: (state, action) => {
      const events = action.payload;
      console.log('events', events)
      // events.forEach(event => state.eventList.push(event));
      state.eventList = [...events] // not sure about this
    },
    createEvent: (state, action) => {

    },
    updateEvent: (state, action) => {

    },
    deleteEvent: (state, action) => {

    },
  },
});

// Action creators are generated for each case reducer function
export const { getEvents, createEvent, updateEvent, deleteEvent } = eventsSlice.actions;

export default eventsSlice.reducer