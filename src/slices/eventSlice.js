import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    eventList: [],
  },
  reducers: {
    getEvents: (state, action) => {
      const events = action.payload;
      state.eventList = events;
    },
    createEvents: (state, action) => {
      const event = action.payload;
      state.eventList.push(...event);
    },
    updateEvents: (state, action) => {
      const updatedEvent = state.eventList.find( event => event.event_id = action.payload.event_id);
      Object.assign(updatedEvent, action.payload);
    },
    deleteEvents: (state, action) => {
      state.eventList.filter( eventItem => eventItem.event_id !== action.payload)
    },
  },
});

export const { getEvents, createEvents, updateEvents, deleteEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
