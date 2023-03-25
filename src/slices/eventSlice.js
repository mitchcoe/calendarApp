import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    eventList: [],
    currentEventList: [],
    selectedDate: null,
  },
  reducers: {
    getEvents: (state, action) => {
      const events = action.payload;
      state.eventList = events;
    },
    getEventsByDay: (state, action) => {
      const eventsByDay = action.payload;
      state.currentEventList = eventsByDay;
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
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    }
  },
});

export const { getEvents, getEventsByDay, createEvents, updateEvents, deleteEvents, setSelectedDate } = eventsSlice.actions;
export default eventsSlice.reducer;
