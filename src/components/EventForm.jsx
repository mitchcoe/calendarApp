import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {MobileDatePicker, TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
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
} from '@mui/material';

export default function EventForm(props) {
  const {handleClick} = props
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

  return(
    <Box component="form" autoComplete="off" sx={{width: '25vw'}}>
      <Card>
        <CardHeader
          sx={cardHeaderStyles}
          title={
            <Typography>
              Create Event
            </Typography>
          }
          action={
            <ButtonGroup id="app_bar" sx={buttonContainerStyles}>
              <IconButton sx={iconButtonStyles}>
                <EditIcon />
              </IconButton>
              <IconButton sx={iconButtonStyles}>
                <DeleteIcon />
              </IconButton>
              <IconButton sx={iconButtonStyles} onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            </ButtonGroup>
          }
        />
        <CardContent sx={cardContentStyles}>
          <TextField
            id="title"
            label="Title"
            sx={fieldStyles}
          />
          <TextField
            id="description"
            label="Description"
            sx={fieldStyles}
          />
          <TextField
            id="location"
            label="Location"
            sx={fieldStyles}
          />
          <TextField
            id="phone"
            label="Phone #"
            sx={fieldStyles}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              id="date"
              // defaultValue="2023-03-22"
              sx={fieldStyles}
            />
            <TimePicker
              id="start_time"
              label="Start Time"
              sx={fieldStyles}
            />
            <TimePicker
              id="end_time"
              label="End Time"
              sx={fieldStyles}
            />
          </LocalizationProvider>
        </CardContent>
        <CardActions id="submit_buttons" sx={buttonContainerStyles}>
          <Button id="submit" variant="outlined">
            Create
          </Button>
          <Button id="clear" variant="outlined" color="primary">
            Clear
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
};
