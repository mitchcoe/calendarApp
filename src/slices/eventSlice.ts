import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../store'
import type { Event, EventToCreate } from '../globalTypes';

interface EventState {
  eventList: Event[],
  currentEventList: Event[],
  selectedDate: string,
}

const initialState: EventState = {
  eventList: [],
  currentEventList: [],
  selectedDate: new Date(Date.now()).toISOString(),
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEvents: (state, action: PayloadAction<Array<Event>>) => {
      // console.log('all events payload',action.payload)
      const events = action.payload;
      state.eventList = events;
    },
    getEventsByDay: (state, action: PayloadAction<Array<Event>>) => {
      // console.log('events by day payload', action.payload)
      const eventsByDay = action.payload;
      state.currentEventList = eventsByDay;
    },
    // createEvents: (state, action: PayloadAction<EventToCreate>) => {
    createEvents: (state, action) => {
      // console.log('create payload', action.payload)
      const event = action.payload;
      state.currentEventList.push(...event);
    },
    updateEvents: (state, action: PayloadAction<Event>) => {
      // console.log('update payload', action.payload)
      let updatedEventIndex = state.currentEventList.findIndex( event => event.event_id === action.payload.event_id);
      if (updatedEventIndex !== - 1) state.currentEventList.splice(updatedEventIndex, 1, action.payload)
    },
    deleteEvents: (state, action: PayloadAction<number>) => {
      // console.log('delete payload', action.payload)
      const itemToDelete = state.currentEventList.findIndex(item => item.event_id === action.payload)
      if (itemToDelete !== - 1) state.currentEventList.splice(itemToDelete, 1)
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    }
  },
});

export const { getEvents, getEventsByDay, createEvents, updateEvents, deleteEvents, setSelectedDate } = eventsSlice.actions;
export default eventsSlice.reducer;
