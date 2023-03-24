import * as React from 'react'
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
  let startTimeMS = new Date(startTime).getTime();
  let endTimeMS = new Date(endTime).getTime();
  return (endTimeMS - startTimeMS) / 1000 / 60 / 15 * 20;
};

export default function Event(props) {
  const { event, zIndex, handleClick } = props;
  const colors = ['blue', 'red', 'green']
  function getRandomColor(max) {
    return colors[Math.floor(Math.random() * max)];
  }

  /**
   * 
   * @param {string} startTime 
   * @returns {number}
   */
  const eventStartTime = (startTime) => {
    let pixels = -800;
    let time = 'AM';
    let hour = new Date(startTime).getHours();
    let minutes = new Date(startTime).getMinutes() / 15 * 20;
    if(hour > 12) {
      hour -= 12;
      time = 'PM'
    }
    time === 'AM' ? pixels += ((hour - 8) * 80 + minutes) : pixels += (320 + (hour * 80) + minutes);
    return pixels;
  };

  return (
    <Paper sx={{
      backgroundColor: `${getRandomColor(3)}`,
      maxHeight: '800px',
      height: `${calculateHeight(event.start_time, event.end_time)}px`,
      transform: `translateY(${eventStartTime(event.start_time)}px) translateX(96px)`,
      padding: '16px 0px 16px 16px',
      maxWidth: 'calc(100vw - 144px)',
      width: '100%',
      mr: '8px',
      position: 'absolute',
      zIndex: `${zIndex}`,
      border: '1px solid black'
      }}
      onClick={(e) => {handleClick(e, event)}}
    >
      <Typography>
        {event.title}
        {event.event_id}
        <br />
        {event.location}
      </Typography>
    </Paper>
  )
};
