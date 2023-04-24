import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  reminder_id: null,
  type: 'email',
  time_before: {
    _0: true,
    _15: false,
    _30: false,
    _45: false,
    _60: false
  },
  reminders_on: false,
  event_id: null,
  todays_reminders: [],
}

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState: {
    ...defaultState,
  },
  reducers: {
    clearReminders: (state, action) => {
      // console.log('clearing reminders')
       Object.assign(state, {
        ...defaultState,
        todays_reminders: state.todays_reminders
      });
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
      let result = []
      const {event_id, time_before} = action.payload;
      let times = time_before.split(' ');
      state.todays_reminders.forEach((reminder) => {
        if(times.includes(reminder.minutes) && reminder.event_id === event_id) {
          result.push(Object.assign(reminder, action.payload))
        } else {
          result.push(reminder)
        }
      })
      state.todays_reminders = result
    },
    handleReminderChanges: (state, action) => {
      // console.log('handleReminderChanges', action.payload)
      Object.assign(state, action.payload);
    },
    updateTimeBefore: (state, action) => {
      // console.log('updateTimeBefore',action.payload);
      state.time_before = Object.assign(state.time_before, action.payload)
    },
    getTodaysReminders: (state, action) => {
      // console.log('getTodaysReminders', action.payload)
      let formattedPayload = []
      action.payload.forEach((item) => {
        const {reminder_id, type, reminders_on, event_id, time_before} = item;
        let times = time_before.split(' ');
        times.forEach(time => formattedPayload.push({ // not great time complexity but oh well
          reminder_id,
          type,
          reminders_on,
          event_id,
          minutes: time,
          open: false,
          dismissed: false
        }))
      })
      state.todays_reminders = formattedPayload;
    },
    openReminderNotification: (state, action) => {
      // console.log('openReminderNotification', action.payload)
      let updatedPayload = Object.assign(action.payload, {
        open: true,
        notification_id: Math.random() + action.payload.event_id + action.payload.minutes
      })
      let reminderToOpen = state.todays_reminders.findIndex(
        reminder => reminder.minutes === action.payload.minutes && reminder.event_id === action.payload.event_id
      );
      if (reminderToOpen !== - 1) state.todays_reminders.splice(reminderToOpen, 1, Object.assign(state.todays_reminders[reminderToOpen], updatedPayload))
    },
    closeReminderNotification: (state, action) => {
      // console.log('closeReminderNotification', action.payload)
      let updatedPayload = Object.assign(action.payload, {open: false, dismissed: true})
      let reminderToClose = state.todays_reminders.findIndex(
        reminder => reminder.minutes === action.payload.minutes && reminder.event_id === action.payload.event_id
      );
      if (reminderToClose !== - 1) state.todays_reminders.splice(reminderToClose, 1, Object.assign(state.todays_reminders[reminderToClose], updatedPayload))
    }
  }
});

export const {
  clearReminders,
  getReminder,
  updateReminder,
  updateTimeBefore,
  handleReminderChanges,
  getTodaysReminders,
  openReminderNotification,
  closeReminderNotification,
} = reminderSlice.actions;
export default reminderSlice.reducer;
