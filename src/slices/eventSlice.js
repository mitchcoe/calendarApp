import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    eventList: [],
  },
  reducers: {
    getEvents: (state, action) => {
      const events = action.payload;
      state.eventList = [...events] // not sure about this
    },
    createEvents: (state, action) => {
      const event = action.payload;
      state.eventList.push(...event);
    },
    updateEvents: (state, action) => {

    },
    deleteEvents: (state, action) => {

    },
  },
});

// Action creators are generated for each case reducer function
export const { getEvents, createEvents, updateEvent, deleteEvent } = eventsSlice.actions;

export default eventsSlice.reducer