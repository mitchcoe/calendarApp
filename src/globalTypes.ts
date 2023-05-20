export type EventType = {
  event_id?: number,
  title?: string,
  description?: string,
  location?: string,
  phone?: string,
  date: string,
  start_time: string,
  end_time: string,
  color?: string,
  hasAttachments?: boolean,
};

export type EventToCreateType = {
  title?: string,
  description?: string,
  location?: string,
  phone?: string,
  date: string,
  start_time: string,
  end_time: string,
  color: string,
  hasAttachments: boolean,
};

export type AttachmentType = {
  attachment_id?: number,
  file_type: string,
  file_name: string,
  file_path: string | ArrayBuffer | null,
  event_id: number,
};

export type ReminderType = {
  reminder_id: number,
  type: string,
  time_before: string,
  reminders_on: boolean,
  event_id: number,
};

export type HandleClickType = (e: React.MouseEvent<HTMLElement>, event: EventType) => void;
