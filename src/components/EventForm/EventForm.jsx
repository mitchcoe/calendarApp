import { useState, useMemo, useCallback, useEffect } from 'react';
import * as React from 'react'
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import {MobileDatePicker, MobileTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  ButtonGroup,
  TextField,
  IconButton,
  CardHeader,
  Typography,
  Modal, 
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { getEvents, createEvents, updateEvents, deleteEvents } from '../../slices/eventSlice';
import {
  clearEventChanges,
  handleEventChanges,
  toggleEditingState,
  setValidState,
  getAttachments,
  clearAttachmentPreviews
} from '../../slices/formSlice';
import AttachmentsModal from '../AttachmentsModal/AttachmentsModal'
import AttachmentsPreview from '../AttachmentsPreview/AttachmentsPreview';
import RemindersMenu from '../RemindersMenu/RemindersMenu';
import ColorPicker from '../ColorPicker/ColorPicker';

/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

const eightAM = dayjs().set('hour', 8).startOf('hour');
const sixPM = dayjs().set('hour', 18).startOf('hour')
const fivePM = dayjs().set('hour', 17).startOf('hour')

export default function EventForm(props) {
  const theme = useTheme();
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false)
  const [reminderMenuAnchor, setReminderMenuAnchor] = useState(null)
  const reminderMenuOpen = Boolean(reminderMenuAnchor);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null)
  const colorPickerOpen = Boolean(colorPickerAnchor)
  const colorPickerId = colorPickerOpen ? 'colorPicker' : undefined;

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'maxDate':
      case 'minDate': {
        return 'Please select a date in the first quarter of 2022';
      }
      case 'invalidDate': {
        return 'Your date is not valid';
      }
      case 'minTime': {
        return 'Please select a time between 8AM and 6PM'
      }
      case 'maxTime': {
        return 'Please select a time between 8AM and 6PM'
      }
      case 'shouldDisableTime-hours': {
        return 'This time range is blocked by other events, please select another time'
      }
      case null: {
        return ''
      }
      default: {
        console.log(error)
        return '';
      }
    }
  }, [error]);

  const events = useSelector((state) => state.events.currentEventList);
  const editingEnabled = useSelector((state) => state.form.editing);
  const { title, description, location,
          phone, date, start_time,
          end_time, anchorType, valid,
          hasAttachments, event_id, attachmentsList, color } = useSelector((state) => state.form)
  // eslint-disable-next-line no-unused-vars
  const { handleClick, handleClose} = props;
  const dispatch = useDispatch();

  const hourMinuteFormat = (position, hourFunc, minuteFunc) => {
    return parseInt(`${position[hourFunc]()}${position[minuteFunc]() === 0 ? '00' : (position[minuteFunc]() < 10 ? `0${position[minuteFunc]()}` : position[minuteFunc]())}`)
  };

  let blockedTimes = events.map((event) => {
    let start = new Date(event.start_time);
    let end = new Date(event.end_time);
    let block = {
      start: hourMinuteFormat(start, 'getHours', 'getMinutes'),
      end: hourMinuteFormat(end, 'getHours', 'getMinutes'),
      event_id: event.event_id
    }
    return block
  });

  if(blockedTimes.length > 0 && event_id) {
    blockedTimes = blockedTimes.filter((time) => time.event_id !== event_id)
  }

  const background = theme.palette.augmentColor({
    color: {
      main: color,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const defaultEvent = {
    title: 'event_placing_test',
    description: 'testing event creation on the front end',
    location: 'Austin, TX',
    date: '2023-03-21',
    start_time: '2023-03-21 09:45:00',
    end_time: '2023-03-21 12:30:00'
  };

  // eslint-disable-next-line no-unused-vars
  // const getEventsData = useCallback(async () => {
  //   await fetch('/events')
  //     .then(response => response.json())
  //     .then(response => dispatch(getEvents(response)))
  //     .catch(error => console.log(error));
  // }, [dispatch]);

  const getAttachmentsData = useCallback( async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  },[dispatch, event_id]);

  useEffect(() => {
    if(hasAttachments) getAttachmentsData()
  }, [getAttachmentsData, hasAttachments]);

  const createEvent = async () => {
    await fetch('/events', {
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title, description, location, phone, date, start_time, end_time}),
    })
      .then(response => response.json())
      .then(response => {
        dispatch(createEvents(response.data));
      })
      .catch(error => console.log(error));
  };

  const updateEvent = async () => {
    let updatedObject = { event_id };
    let formChanges = {
      title,
      description,
      location,
      phone,
      date,
      start_time,
      end_time,
      color
    }

    for(let key in formChanges) {
      if(key) {
        updatedObject[key] = formChanges[key]
      }
    }
    // console.log('updatedObject',updatedObject)
    
    await fetch('/events', {
      method:'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedObject),
    })
    .then(response => response.json())
    .then(response => dispatch(updateEvents(response.updated)))
    .catch(error => console.log(error));
  };

  const deleteEvent = async () => {
    await fetch('/events', {
      method:'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ event_id }),
    })
      .then(response => response.json())
      .then(response => dispatch(deleteEvents(response.id)))
      .catch(error => console.log(error));
  };

  const handleCreateSubmit = (event) => {
    createEvent();
    handleClose(event);
  };

  const handleUpdateSubmit = (event) => {
    updateEvent();
    handleClose(event)
  };

  // const handleDelete = (event) => {
  //   deleteEvent();
  //   handleClose(event);
  // }

  const handleClear = () => {
    dispatch(clearEventChanges());
    setDateValue('');
    setStartValue('');
    setEndValue('');
    dispatch(setValidState(false));
  };

  const handleFieldChange = (event) => {
    dispatch(handleEventChanges({[event.target.id]: event.target.value}))
  };

  const handeDateFieldChange = (event) => {
    setDateValue(event)
    dispatch(handleEventChanges({date: `${event['$y']}-0${event['$M']+ 1}-${event['$D']}`}))
  };

  const handleStartTimeFieldChange = (event) => {
    if(event === null) return
    setStartValue(event)
    dispatch(handleEventChanges({start_time: event['$d'].toISOString()}))
  };

  const handleEndTimeFieldChange = (event) => {
    if(event === null) return
    setEndValue(event)
    dispatch(handleEventChanges({end_time: event['$d'].toISOString()}))
  };

  const handleColorChange = (color) => {
    dispatch(handleEventChanges({color: color}))
  };

  const handleEditToggle = (event) => {
    dispatch(toggleEditingState(!editingEnabled))
  };

  const handleError = (err) => {
    if(err === null) {
      dispatch(setValidState(true));
      setError(null);
    } else {
      dispatch(setValidState(false));
      setError(err);
    }
  };

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  const handleModalCloseAndDelete = (event) => {
    handleClose(event);
    setModalOpen(false);
    deleteEvent();
  };

  const handleAttachmentsModalOpen = () => setAttachmentsModalOpen(true)
  const handleAttachmentsModalClose = () => {
    setAttachmentsModalOpen(false);
    dispatch(clearAttachmentPreviews());
  };

  const handleColorPickerClick = (event) => setColorPickerAnchor(event.currentTarget);
  const handleColorPickerClose = () => setColorPickerAnchor(null);

  const handleReminderClick = (event) => setReminderMenuAnchor(event.currentTarget);

  const handleReminderMenuClose = () => setReminderMenuAnchor(null);

  const cardHeaderStyles = {
    display: 'flex',
    backgroundColor: color
  };
  const cardContentStyles = {
    display: 'flex',
    flexDirection: 'column',
  }
  const buttonContainerStyles = { 
    display: 'flex',
    justifyContent: 'space-evenly',
  };
  const iconButtonStyles = {
    ml: '16px',
    color: theme.palette.getContrastText(background.main)
  }
  // eslint-disable-next-line no-unused-vars
  const submitButtonStyles = {
    // backgroundColor
  }
  const fieldStyles = {
    mb: '16px'
  }

  const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const DeleteModal = () => (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Are You Sure You Want To Delete This Event?
      </Typography>
      <div css={[buttonContainerStyles, {marginTop: '16px'}]}>
        <Button variant="outlined" onClick={handleModalClose} data-testid="modal_close_button">
          No
        </Button>
        <Button variant="outlined" onClick={handleModalCloseAndDelete} data-testid="modal_delete_button">
          Yes
        </Button>
      </div>
      </Box>
    </Modal>
  );

  const customTextField = (label, value) => (
    <TextField
      id={label.toLowerCase()}
      label={label}
      sx={fieldStyles}
      value={value}
      onChange={handleFieldChange}
      disabled={ anchorType === 'Create' ? false : !editingEnabled }
    />
  );

  const customTimePicker = (props) => {
    const { timeType, timeTypeValueState, timeTypeValueRedux, minimumTime, maximumTime, onChangeFunc} = props
    let formattedLabel = (label) => {
      return label.split('_')
        .map((item) => item = item.charAt(0).toUpperCase() + item.slice(1))
        .join(' ');
    };

    return(
      <Tooltip
      disableFocusListener
      disableTouchListener
      disableHoverListener={!!date}
      title="Select a valid date first"
    >
      {/* this div is needed because of what i think is this issue: https://github.com/mui/material-ui/issues/33476 */}
      <div css={{display: 'inline-flex', width: '100%'}}> 
        <MobileTimePicker
          data-testid={"error_message"}
          id={timeType}
          label={formattedLabel(timeType)}
          sx={[fieldStyles, {width: '100%'}]}
          disabled={ (anchorType === 'Create' ? false : !editingEnabled) || !date }
          minTime={minimumTime}
          maxTime={maximumTime}
          shouldDisableTime={(value, view) => {
            if(anchorType === 'Update' && !editingEnabled) return false
            let formattedValue = hourMinuteFormat(value, 'hour', 'minute')

            return view === 'hours' && blockedTimes.some((time) => {
              if(editingEnabled && formattedValue >= time.start && formattedValue <= time.end && time.event_id === event_id) {
                return false
              } 
              if(timeType === 'start_time' && time.event_id !== event_id) {
                let end = dayjs(end_time)
                end = hourMinuteFormat(end, 'hour', 'minute')
                if(formattedValue > end) return true
                let blocked = blockedTimes.filter((time) => {
                  return time.end > formattedValue && time.end < end
                })
                return blocked.length >= 1
              }
              if(timeType === 'end_time' && time.event_id !== event_id) {
                let start = dayjs(start_time)
                start = hourMinuteFormat(start, 'hour', 'minute')
                if(formattedValue < start) return true
                let blocked = blockedTimes.filter((time) => {
                  return time.start < formattedValue && time.start > start
                })
                return blocked.length >= 1 
              }
              return formattedValue > time.start && formattedValue < time.end
            })
            }
          }
          value={timeTypeValueState || (timeTypeValueRedux && dayjs(timeTypeValueRedux))}
          onChange={onChangeFunc}
          onError={(newError) => handleError(newError)}
          slotProps={{
            textField: {
              helperText: errorMessage,
            },
          }}
        />
      </div>
    </Tooltip>
    );
  };

  const startTimePicker = customTimePicker({
    timeType: 'start_time',
    timeTypeValueState: startValue,
    timeTypeValueRedux: start_time,
    minimumTime: eightAM,
    maximumTime: fivePM,
    onChangeFunc: handleStartTimeFieldChange,
  })

  const endTimePicker = customTimePicker({
    timeType: 'end_time',
    timeTypeValueState: endValue,
    timeTypeValueRedux: end_time,
    minimumTime: eightAM,
    maximumTime: sixPM,
    onChangeFunc: handleEndTimeFieldChange,
  })

  return(
    <Box
      component="form"
      encType="multipart/form-data"
      autoComplete="off"
      sx={{minWidth: '300px', width: '30vw'}}
      data-testid="event_form"
    >
      <Card>
        <CardHeader
          sx={cardHeaderStyles}
          title={
            <Typography
              style={{
                color: theme.palette.getContrastText(background.main),
              }}
            >
              {anchorType} Event
            </Typography>
          }
          action={
            <ButtonGroup id="app_bar" sx={buttonContainerStyles}>
              <Tooltip title="Reminders">
                <IconButton sx={iconButtonStyles} onClick={handleReminderClick} data-testid="reminder_button">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <RemindersMenu
                open={reminderMenuOpen}
                anchorEl={reminderMenuAnchor}
                onClose={handleReminderMenuClose}
                event_id={event_id}
                start_time={start_time}
              />
              {anchorType && anchorType === 'Update' && (
                <React.Fragment>
                  <Tooltip title="Edit Event">
                    <IconButton sx={iconButtonStyles} onClick={handleEditToggle} data-testid="edit_button">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {editingEnabled ? (
                    <React.Fragment>
                      <Tooltip title="Change Color">
                      <IconButton sx={iconButtonStyles} onClick={handleColorPickerClick} data-testid="color_button">
                        <PaletteIcon />
                      </IconButton>
                      </Tooltip>
                      <ColorPicker 
                        open={colorPickerOpen}
                        anchorEl={colorPickerAnchor}
                        onClose={handleColorPickerClose}
                        id={colorPickerId}
                        dispatchFunction={handleColorChange}
                      />
                      <Tooltip title="Add Attachments">
                        <IconButton sx={iconButtonStyles} onClick={handleAttachmentsModalOpen} data-testid="attachment_button">
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Event">
                        <IconButton sx={iconButtonStyles} onClick={handleModalOpen} data-testid="delete_button">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </React.Fragment>
                  ): null }
                </React.Fragment>
              )}
              <Tooltip title="Close">
                <IconButton sx={iconButtonStyles} onClick={handleClose} data-testid="close_button">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          }
        />
        <CardContent sx={cardContentStyles}>
          {customTextField('Title', title)}
          {customTextField('Description', description)}
          {customTextField('Location', location)}
          {customTextField('Phone', phone)}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              data-testid="date_picker"
              controlled
              id="date"
              label="Date"
              disablePast
              required
              sx={fieldStyles}
              value={dateValue || (date && dayjs(date))}
              onChange={handeDateFieldChange}
              disabled={ anchorType === 'Create' ? false : !editingEnabled }
            />
            {startTimePicker}
            {endTimePicker}
          </LocalizationProvider>
          {attachmentsList?.length ? (
          <Accordion
            sx={{
              position: 'fixed',
              bottom: 55,
              zIndex: "1000",
              width: '100%',
              ml: '-16px !important',
              borderTop: '1px solid black',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{transform: 'rotate(180deg)'}}/>}
              aria-controls="attachments-content"
              id="attachments-header"
              sx={{bgcolor: 'white', borderBottom: '1px solid black',}}
            >
              <Typography>
                Attachments
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{height: '100%'}}>
              <AttachmentsPreview
                attachmentsList={attachmentsList}
                event_id={event_id}
                mode="current"
              />
            </AccordionDetails>
          </Accordion>
          ) : null}
        </CardContent>
        <CardActions id="submit_buttons" sx={[buttonContainerStyles, {mt: 4}]}>
          <Button //form needs validation before this should be enabled
            data-testid="submit_button"
            id="submit"
            variant="outlined"
            sx={{visibility: (anchorType === 'Update' && editingEnabled) ? 'unset' : anchorType === 'Create' ? 'unset' : 'hidden'}}
            disabled={ anchorType === 'Create' ? !valid : !editingEnabled || !valid }
            onClick={anchorType && anchorType === 'Create' ? handleCreateSubmit : handleUpdateSubmit}
          >
            {anchorType}
          </Button>
          <Button
            data-testid="clear_button"
            id="clear"
            variant="outlined"
            color="primary"
            sx={{visibility: anchorType === 'Update' && editingEnabled ? 'unset' : anchorType === 'Create' ? 'unset' : 'hidden'}}
            onClick={handleClear}
            disabled={anchorType === 'Create' ? editingEnabled : !editingEnabled}
          >
            Clear
          </Button>
        </CardActions>
      </Card>
      <DeleteModal data-testid="delete_modal"/>
      <AttachmentsModal
        attachmentsModalOpen={attachmentsModalOpen}
        handleAttachmentsModalClose={handleAttachmentsModalClose}
        modalStyles={modalStyles}
        hasAttachments={hasAttachments}
        event_id={event_id}
      />
    </Box>
  )
};
