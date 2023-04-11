import { useState,  useMemo, useCallback, useEffect } from 'react';
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

export default function RemindersMenu(props) {
  const { open, anchorEl, onClose } = props
  const [remindersOn, setRemindersOn] = useState(true)
  const [reminderType, setReminderType] = useState('email')
  const [checkedState, setCheckedState] = useState({
    _15: false,
    _30: true,
    _45: false,
    _60: true
  });

  const handleRemindersStatusChange = () => setRemindersOn(!remindersOn)
  const handleTypeChange = (event) => setReminderType(event.target.value)
  const handleTimeChange = (event) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked
    })
  }
  const { _15, _30, _45, _60 } = checkedState

  return(
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      // onClick={(e) => e.stopPropagation()}
    >
      <FormControl>
        <MenuItem>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={remindersOn}
                  onChange={handleRemindersStatusChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={`Reminders are ${remindersOn ? 'On' : "Off"}`}
            />
          </FormGroup>
        </MenuItem>
        <MenuItem>
          <FormLabel id="radio-buttons-group-label" sx={{pr: 2}}>Type:</FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue="email"
            name="radio-buttons-group"
            value={reminderType}
            onChange={handleTypeChange}
          >
            <FormControlLabel disabled={!remindersOn} value="email" control={<Radio />} label="Email" />
            <FormControlLabel disabled={!remindersOn} value="text" control={<Radio />} label="Text" />
            <FormControlLabel disabled={!remindersOn} value="notification" control={<Radio />} label="Notification" />
          </RadioGroup>
        </MenuItem>
        <MenuItem>
          <FormGroup column="true">
            <FormLabel id="checkbox-buttons-group-label" sx={{pr: 2}}>Time before event:</FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={_15} onChange={handleTimeChange} name="_15" />
              }
              label="15 Minutes"
              disabled={!remindersOn}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_30} onChange={handleTimeChange} name="_30" />
              }
              label="30 Minutes"
              disabled={!remindersOn}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_45} onChange={handleTimeChange} name="_45" />
              }
              label="45 Minutes"
              disabled={!remindersOn}
            />
            <FormControlLabel
              control={
                <Checkbox checked={_60} onChange={handleTimeChange} name="_60" />
              }
              label="1 Hour"
              disabled={!remindersOn}
            />
          </FormGroup>
        </MenuItem>
      </FormControl>
    </Menu>
  );
};
