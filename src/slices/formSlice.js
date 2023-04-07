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
  attachmentPreviews: [],
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
    deleteAttachments: (state, action) => {
      // console.log('delete attachments', action.payload)
      const itemToDelete = state.attachmentsList.findIndex(item => item.attachment_id === action.payload)
      if (itemToDelete !== - 1) state.attachmentsList.splice(itemToDelete, 1)
    },
    setAttachmentPreviews: (state, action) => {
      // console.log('setAttachmentPreviews', action)
      let preview = action.payload;
      state.attachmentPreviews.push(preview)
    },
    deleteAttachmentPreviews: (state, action) => {
      const itemToDelete = state.attachmentPreviews.findIndex(item => item.file_name === action.payload)
      if (itemToDelete !== - 1) state.attachmentPreviews.splice(itemToDelete, 1)
    },
    clearAttachmentPreviews: (state, action) => {
      state.attachmentPreviews = [];
    },
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
  deleteAttachments,
  setAttachmentPreviews,
  deleteAttachmentPreviews,
  clearAttachmentPreviews,
} = formSlice.actions;
export default formSlice.reducer;
