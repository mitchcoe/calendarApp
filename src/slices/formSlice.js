import { createSlice } from '@reduxjs/toolkit';

const defaultFormState = {
  title: '',
  description: '',
  location: '',
  phone: '',
  date: '',
  start_time: '',
  end_time: '',
  valid: true,
  hasAttachments: false,
  hasReminders: false,
  attachmentsList: [],
};

const closedState = {
  // anchorEl: null,
  editing: false,
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
        Object.assign(state, closedState);
      }
    },
    handleEventChanges: (state, action) => {
      // console.log('handle event change', action.payload, Object.values(Object.assign(state, action.payload)))
      Object.assign(state, action.payload);
    },
    clearEventChanges: (state, action) => {
      // let clear = Object.assign(state, defaultFormState);
      // console.log(Object.values(clear))
      Object.assign(state, defaultFormState);
    },
    toggleEditingState: (state, action) => {
      // console.log('editing',state.editing)
      state.editing = !state.editing
    },
    setValidState: (state, action) => {
      state.valid = action.payload
    },
    getAttachments: (state, action) => {
      // console.log('getAttachment', action.payload)
      let attachments = action.payload
      state.attachmentsList = attachments
    },
    addAttachments: (state, action) => {
      // console.log('addAttachment', action.payload)
      let attachment = action.payload
      state.attachmentsList.push(...attachment)
    },
    // deleteAttachments: (state, action) => {
    // },
  },
});

export const {
  toggleEventForm,
  handleEventChanges,
  clearEventChanges,
  toggleEditingState,
  setValidState,
  getAttachments,
  addAttachments,
  // deleteAttachments
} = formSlice.actions;
export default formSlice.reducer;
