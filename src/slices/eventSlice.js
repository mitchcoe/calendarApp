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
      const event = action.payload;
    },
    deleteEvents: (state, action) => {
      const id = action.payload;
      state.eventList.filter( eventItem => eventItem.event_id !== id)
    },
  },
});

// Action creators are generated for each case reducer function
export const { getEvents, createEvents, updateEvents, deleteEvents } = eventsSlice.actions;

export default eventsSlice.reducer