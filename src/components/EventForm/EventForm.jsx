import { useState, useCallback, useMemo } from 'react';
import * as React from 'react'
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
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
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { getEvents, createEvents, updateEvents, deleteEvents } from '../../slices/eventSlice';
import { clearEventChanges, handleEventChanges, toggleEditingState, setValidState } from '../../slices/formSlice';
/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

const eightAM = dayjs().set('hour', 8).startOf('hour');
const sixPM = dayjs().set('hour', 18).startOf('hour')
const fivePM = dayjs().set('hour', 17).startOf('hour')

export default function EventForm(props) {
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)

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
      case null: {
        return ''
      }
      default: {
        console.log(error)
        return '';
      }
    }
  }, [error]);

  // eslint-disable-next-line no-unused-vars
  const events = useSelector((state) => state.events.eventList);
  const formId = useSelector((state) => state.form.event_id);
  const editingEnabled = useSelector((state) => state.form.editing);
  const { title, description, location, phone, date, start_time, end_time, anchorType, valid } = useSelector((state) => state.form)
  // eslint-disable-next-line no-unused-vars
  const { handleClick, eventId, handleClose} = props;
  const dispatch = useDispatch();

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
  const getEventsData = useCallback(async () => {
    await fetch('/events')
      .then(response => response.json())
      .then(response => dispatch(getEvents(response)))
      .catch(error => console.log(error));
  }, [dispatch]);

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
    let updatedObject = { event_id: formId };
    let formChanges = {
      title,
      description,
      location,
      phone,
      date,
      start_time,
      end_time,
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
      body: JSON.stringify({event_id: formId}),
    })
      .then(response => response.json())
      .then(response => dispatch(deleteEvents(response.id)))
      .catch(error => console.log(error));
  };

  const handleCreateSubmit = (event) => {
    createEvent();
    handleClick(event);
  };

  const handleUpdateSubmit = (event) => {
    updateEvent();
    handleClick(event)
  };

  const handleDelete = (event) => {
    deleteEvent();
    handleClose(event);
  }

  const handleClear = () => {
    dispatch(clearEventChanges());
    setDateValue('');
    setStartValue('');
    setEndValue('');
    dispatch(setValidState(false));
  }

  const handleFieldChange = (event) => {
    dispatch(handleEventChanges({[event.target.id]: event.target.value}))
  }

  const handeDateFieldChange = (event) => {
    setDateValue(event)
    dispatch(handleEventChanges({date: `${event['$y']}-0${event['$M']+ 1}-${event['$D']}`}))
  }

  const handleStartTimeFieldChange = (event) => {
    if(event === null) return
    setStartValue(event)
    dispatch(handleEventChanges({start_time: event['$d'].toISOString()}))
  }

  const handleEndTimeFieldChange = (event) => {
    if(event === null) return
    setEndValue(event)
    dispatch(handleEventChanges({end_time: event['$d'].toISOString()}))
  }

  const handleEditToggle = (event) => {
    dispatch(toggleEditingState(!editingEnabled))
  }

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
    setModalOpen(false);
    handleDelete(event);
  };

  const cardHeaderStyles = {
    display: 'flex',
    backgroundColor: 'red'
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
    ml: '16px'
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
        <Button variant="outlined" onClick={handleModalClose}>
          No
        </Button>
        <Button variant="outlined" onClick={handleModalCloseAndDelete}>
          Yes
        </Button>
      </div>
      </Box>
    </Modal>
  )

  const customTextField = (label, value) => (
    <TextField
      id={label.toLowerCase()}
      label={label}
      sx={fieldStyles}
      value={value}
      onChange={handleFieldChange}
      disabled={ anchorType === 'Create' ? false : !editingEnabled }
    />
  )

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
          id={timeType}
          label={formattedLabel(timeType)}
          sx={[fieldStyles, {width: '100%'}]}
          disabled={ (anchorType === 'Create' ? false : !editingEnabled) || !date }
          minTime={minimumTime}
          maxTime={maximumTime}
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
    <Box component="form" autoComplete="off" sx={{minWidth: '300px', width: '30vw'}} data-testid="event_form">
      <Card>
        <CardHeader
          sx={cardHeaderStyles}
          title={
            <Typography>
              {anchorType} Event
            </Typography>
          }
          action={
            <ButtonGroup id="app_bar" sx={buttonContainerStyles}>
              {anchorType && anchorType === 'Update' && (
                <React.Fragment>
                  <IconButton sx={iconButtonStyles} onClick={handleEditToggle}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={iconButtonStyles} onClick={handleModalOpen}>
                    <DeleteIcon />
                  </IconButton>
                </React.Fragment>
              )}
              <IconButton sx={iconButtonStyles} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
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
        </CardContent>
        <CardActions id="submit_buttons" sx={buttonContainerStyles}>
          <Button //form needs validation before this should be enabled
            id="submit"
            variant="outlined"
            sx={{visibility: (anchorType === 'Update' && editingEnabled) ? 'unset' : anchorType === 'Create' ? 'unset' : 'hidden'}}
            disabled={ anchorType === 'Create' ? !valid : !editingEnabled || !valid }
            onClick={(event) => {
              anchorType && anchorType === 'Create' ? handleCreateSubmit(event) : handleUpdateSubmit(event)
            }}
          >
            {anchorType}
          </Button>
          <Button
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
      <DeleteModal />
    </Box>
  )
};