import { createSlice } from '@reduxjs/toolkit';

const defaultFormState = {
  title: '',
  description: '',
  location: '',
  phone: '',
  date: '',
  start_time: '',
  end_time: '',
};

const closedState = {
  // anchorEl: null,
  anchorType: null,
  open: false,
  anchorId: null,
  event_id: null,
  ...defaultFormState,
}
export const formSlice = createSlice({
  name: 'form',
  initialState: {
    ...closedState,
  },
  reducers: {
    toggleEventForm: (state, action) => {
      if(action.payload.open === true) {
        Object.assign(state, action.payload);
      } else {
        Object.assign(state ,closedState);
      }
    },
    handleEventChanges: (state, action) => {
      console.log('handle event change', action.payload, Object.values(Object.assign(state, action.payload)))
      Object.assign(state, action.payload);
    },
    clearEventChanges: (state, action) => {
      let blah = Object.assign(state, defaultFormState);
      console.log(Object.values(blah))
      Object.assign(state, defaultFormState);
    },
  },
});

export const { toggleEventForm, handleEventChanges, clearEventChanges } = formSlice.actions;
export default formSlice.reducer;
