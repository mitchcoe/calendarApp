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
      let updatedEventIndex = state.eventList.findIndex( event => event.event_id === action.payload.event_id);
      if (updatedEventIndex !== - 1) state.eventList.splice(updatedEventIndex, 1, action.payload)
    },
    deleteEvents: (state, action) => {
      const itemToDelete = state.eventList.findIndex(item => item.event_id === action.payload)
      if (itemToDelete !== - 1) state.eventList.splice(itemToDelete, 1)
    },
  },
});

export const { getEvents, createEvents, updateEvents, deleteEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
