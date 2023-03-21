import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

/**
 * 
 * @param {string} startTime 
 * @param {string} endTime 
 * @returns {number}
 * This calculates the time difference and multiplies the result 
 * by 20 (20px is 1/4th the cell so 15 minutes.)
 */
const calculateHeight = (startTime, endTime) => {
  let startTimeMS = new Date(startTime.slice(0, startTime.length - 1)).getTime();
  let endTimeMS = new Date(endTime.slice(0, endTime.length - 1)).getTime();
  return (endTimeMS - startTimeMS) / 1000 / 60 / 15 * 20;
};

export default function Event(props) {
  const { event } = props;

  return (
    <Paper sx={{
      backgroundColor: 'green',
      maxHeight: '800px',
      height: `${calculateHeight(event.start_time, event.end_time)}px`,
      padding: '16px 0px 16px 16px',
      width: '100%',
      mr: '8px',
      }}
    >
      <Typography>
        {event.title}
        <br />
        {event.location}
      </Typography>
    </Paper>
  )
};
