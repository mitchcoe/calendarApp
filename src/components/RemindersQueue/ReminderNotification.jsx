import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ReminderNotification(props) {
  const { open, onClose, title, minutes } = props;
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert severity="warning">{`${title} is starting in ${minutes} minutes`}</Alert>
    </Snackbar>
  )
};
