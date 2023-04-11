import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  reminder_id: null,
  type: 'email',
  time_before: {
    _0: false,
    _15: false,
    _30: false,
    _45: false,
    _60: false
  },
  reminders_on: false,
  event_id: null,
}

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState: {
    ...defaultState,
  },
  reducers: {
    clearReminders: (state, action) => {
       Object.assign(state, defaultState);
    },
    getReminder: (state, action) => {
      // console.log('getReminder', action.payload)
      let updatedTimes = {}
      let times = ['0','15','30','45','60'];
      let { time_before } = action.payload;
      time_before = time_before.split(' ');
      
      time_before.forEach((time) => {
        if(times.includes(time)) {
          updatedTimes[`_${time}`] = true
        } else {
          updatedTimes[`_${time}`] = false
        }
      })

      let formattedPayload = Object.assign(action.payload, {
        time_before: {
          ...state.time_before,
          ...updatedTimes
        }
      });

      Object.assign(state, formattedPayload);
    },
    updateReminder: (state, action) => {
      // console.log('updateReminder', action.payload)
      Object.assign(state, action.payload);
    },
    handleReminderChanges: (state, action) => {
      // console.log('handleReminderChanges', action.payload)
      Object.assign(state, action.payload);
    },
    updateTimeBefore: (state, action) => {
      // console.log('updateTimeBefore',action.payload);
      state.time_before = Object.assign(state.time_before, action.payload)
    },
  }
});

export const {
  clearReminders,
  getReminder,
  updateReminder,
  updateTimeBefore,
  handleReminderChanges,
} = reminderSlice.actions;
export default reminderSlice.reducer;
