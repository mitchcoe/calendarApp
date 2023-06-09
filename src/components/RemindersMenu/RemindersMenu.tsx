import { useCallback, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  clearReminders,
  updateTimeBefore,
  getReminder,
  updateReminder,
  handleReminderChanges,
} from '../../slices/reminderSlice'

type RemindersMenuProps = {
  open: boolean,
  anchorEl: HTMLElement | null,
  onClose: () => void,
  event_id: number | null,
  anchorType: string | null,
}

export default function RemindersMenu(props: RemindersMenuProps) {
  const { open, anchorEl, onClose, event_id, anchorType } = props
  const { type, reminders_on } = useAppSelector((state) => state.reminder)
  const { _0 ,_15, _30, _45, _60 } = useAppSelector((state) => state.reminder.time_before)
  const dispatch = useAppDispatch();

  const getReminderData = useCallback( async () => {
    await fetch(`/reminders/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getReminder(response)))
      .catch(error => console.log(error));
  }, [dispatch, event_id])

  useEffect(() => {
    if(open && anchorType === 'Update') getReminderData()
  }, [getReminderData, open, anchorType]);

  const updateReminderData = async () => {
    let updatedObject = {
      type,
      reminders_on,
      time_before: '',
    };
    let times = ['0','15','30','45','60']
    let result: string[] = [];
    [_0, _15, _30, _45, _60].forEach((item, index) => {
      if(item === true) result.push(times[index])
    })

    updatedObject.time_before = result.join(' ')

    await fetch(`/reminders/${event_id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedObject),
    })
    .then(response => response.json())
    .then(response => dispatch(updateReminder(response.updated)))
    .catch(error => console.log(error));
  };

  const handleRemindersStatusChange = () => {
    dispatch(handleReminderChanges({reminders_on: !reminders_on}))
  }
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handleReminderChanges({type: event.target.value}));
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTimeBefore({[event.target.name]: event.target.checked}));
  };

  const handleClose = async () => {
    if(anchorType === 'Update') {
      await updateReminderData();
      dispatch(clearReminders())
    }
    onClose();
  }

  return(
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
    >
      <FormControl>
        <MenuItem>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={reminders_on}
                  onChange={handleRemindersStatusChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={`Reminders are ${reminders_on ? 'On' : "Off"}`}
            />
          </FormGroup>
        </MenuItem>
        <MenuItem>
          <FormLabel id="radio-buttons-group-label" sx={{pr: 2}}>Type:</FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue="email"
            name="radio-buttons-group"
            value={type || null}
            onChange={handleTypeChange}
          >
            <FormControlLabel disabled={!reminders_on} value="email" control={<Radio />} label="Email" />
            <FormControlLabel disabled={!reminders_on} value="text" control={<Radio />} label="Text" />
            <FormControlLabel disabled={!reminders_on} value="notification" control={<Radio />} label="Notification" />
          </RadioGroup>
        </MenuItem>
        <MenuItem>
          <FormGroup>
            <FormLabel id="checkbox-buttons-group-label" sx={{pr: 2}}>Time before event:</FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={_15 || false} onChange={handleTimeChange} name="_15" />
              }
              label="15 Minutes"
              disabled={!reminders_on}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_30 || false} onChange={handleTimeChange} name="_30" />
              }
              label="30 Minutes"
              disabled={!reminders_on}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_45 || false} onChange={handleTimeChange} name="_45" />
              }
              label="45 Minutes"
              disabled={!reminders_on}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_60 || false} onChange={handleTimeChange} name="_60" />
              }
              label="1 Hour"
              disabled={!reminders_on}
            />
          </FormGroup>
        </MenuItem>
      </FormControl>
    </Menu>
  );
};
