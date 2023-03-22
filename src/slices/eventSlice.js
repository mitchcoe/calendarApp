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
    updateEvents: (state, action) => { //this is broken, reeds the redux docs
      console.log(action.payload)
      // const updatedEvent = state.eventList.find( event => event.event_id = action.payload.event_id);
      // updatedEvent = {
      //   ...action.payload
      // };
    },
    deleteEvents: (state, action) => { //also not really working
      const id = action.payload;
      state.eventList.filter( eventItem => eventItem.event_id !== id)
      // console.log('state',state.eventList)
    },
  },
});

// Action creators are generated for each case reducer function
export const { getEvents, createEvents, updateEvents, deleteEvents } = eventsSlice.actions;

export default eventsSlice.reducer