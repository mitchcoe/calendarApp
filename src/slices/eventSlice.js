import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    eventList: [],
    currentEventList: [],
    selectedDate: new Date(Date.now()).toISOString(),
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
      state.currentEventList.push(...event);
    },
    updateEvents: (state, action) => {
      let updatedEventIndex = state.currentEventList.findIndex( event => event.event_id === action.payload.event_id);
      if (updatedEventIndex !== - 1) state.currentEventList.splice(updatedEventIndex, 1, action.payload)
    },
    deleteEvents: (state, action) => {
      const itemToDelete = state.currentEventList.findIndex(item => item.event_id === action.payload)
      if (itemToDelete !== - 1) state.currentEventList.splice(itemToDelete, 1)
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    }
  },
});

export const { getEvents, getEventsByDay, createEvents, updateEvents, deleteEvents, setSelectedDate } = eventsSlice.actions;
export default eventsSlice.reducer;
