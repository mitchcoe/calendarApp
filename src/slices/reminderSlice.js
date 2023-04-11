import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  reminder_id: null,
  type: 'email',
  time_before: ['0'],
  reminders_on: true,
  event_id: null,
}

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState: {
    ...defaultState,
  },
  reducers: {
    toggleReminders: (state, action) => {
      if(action.payload.reminder_id) {
        Object.assign(state, action.payload);
      } else {
        Object.assign(state, defaultState);
      }
    },
    updateType: (state, action) => {
      state.type = action.payload
    },
    updateTimeBefore: (state, action) => {
      state.time_before = action.payload
    },
    updateRemindersOn: (state, action) => {
      state.reminders_on = action.payload
    },
  }
});

export const { toggleReminders, updateType, updateTimeBefore, updateRemindersOn} = reminderSlice.actions;
export default reminderSlice.reducers;
