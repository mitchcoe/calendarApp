import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../store';
import { AttachmentType } from '../globalTypes';

interface DefaultFormState {
  title: string,
  description: string,
  location: string,
  phone: string,
  date: string,
  start_time: string,
  end_time: string,
  valid: boolean,
  hasAttachments: boolean,
  hasReminders: boolean,
  attachmentsList: AttachmentType[],
  attachmentPreviews: AttachmentType[],
  color: string
};

interface ClosedState extends DefaultFormState {
  editing: boolean,
  anchorType: string | null,
  open: boolean,
  event_id: number | null,
};

const defaultFormState: DefaultFormState = {
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
  color: '#2196f3'
};

const closedState: ClosedState = {
  // anchorEl: null,
  editing: false,
  anchorType: null,
  open: false,
  event_id: null,
  ...defaultFormState,
};

type ToggleEventFormPayloadType = {
  open?: boolean,
  anchorType?: string,
  event_id?: number | null,
  editing? : boolean,
};

type HandleEventChangesPayloadType = {
  event_id?: number,
  title?: string,
  description?: string,
  location?: string,
  phone?: string,
  date?: string,
  start_time?: string,
  end_time?: string,
  color?: string,
  hasAttachments?: boolean,
};

export const formSlice = createSlice({
  name: 'form',
  initialState: closedState,
  reducers: {
    toggleEventForm: (state, action: PayloadAction<ToggleEventFormPayloadType>) => {
      // console.log(`i should turn ${action.payload.open === true ? 'on' : 'off'}`, action.payload)
      if(action.payload.open === true) {
        Object.assign(state, action.payload);
      } else {
        Object.assign(state, closedState);
      }
    },
    handleEventChanges: (state, action: PayloadAction<HandleEventChangesPayloadType>) => {
      // console.log('handle event change', action.payload, Object.entries(Object.assign(state, action.payload)))
      Object.assign(state, action.payload);
    },
    clearEventChanges: (state, action: PayloadAction<object | null>) => {
      if(action.payload && 'color' in action.payload) {
        Object.assign(state, {...defaultFormState, color: action.payload.color});
      } else {
        Object.assign(state, defaultFormState);
      }
      // let clear = Object.assign(state, defaultFormState);
      // console.log('clearing', Object.values(clear))
    },
    toggleEditingState: (state, action) => {
      // console.log('editing',state.editing)
      state.editing = !state.editing
    },
    setValidState: (state, action: PayloadAction<boolean>) => {
      state.valid = action.payload
    },
    getAttachments: (state, action: PayloadAction<AttachmentType[]>) => {
      // console.log('getAttachment', action.payload)
      let attachments = action.payload
      state.attachmentsList = attachments
    },
    addAttachments: (state, action: PayloadAction<AttachmentType[]>) => {
      // console.log('addAttachment', action.payload)
      let attachment = action.payload
      state.attachmentsList.push(...attachment)
    },
    deleteAttachments: (state, action: PayloadAction<number>) => {
      // console.log('delete attachments', action.payload)
      const itemToDelete = state.attachmentsList.findIndex(item => item.attachment_id! === action.payload)
      if (itemToDelete !== - 1) state.attachmentsList.splice(itemToDelete, 1)
    },
    setAttachmentPreviews: (state, action: PayloadAction<AttachmentType>) => {
      // console.log('setAttachmentPreviews', action)
      let preview = action.payload;
      state.attachmentPreviews.push(preview)
    },
    deleteAttachmentPreviews: (state, action: PayloadAction<string>) => {
      const itemToDelete = state.attachmentPreviews.findIndex(item => item.file_name === action.payload)
      if (itemToDelete !== - 1) state.attachmentPreviews.splice(itemToDelete, 1)
    },
    clearAttachmentPreviews: (state, action: PayloadAction<void>) => {
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
