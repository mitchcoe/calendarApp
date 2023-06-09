import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { EventType, HandleClickType } from '../../globalTypes'

/**
 * 
 * @param {string} startTime 
 * @param {string} endTime 
 * @returns {number}
 * This calculates the time difference and multiplies the result 
 * by 20 (20px is 1/4th the cell so 15 minutes.)
 */
const calculateHeight = (startTime: string, endTime: string) => {
  let startTimeMS = new Date(startTime).getTime();
  let endTimeMS = new Date(endTime).getTime();
  return (endTimeMS - startTimeMS) / 1000 / 60 / 15 * 20;
};

type EventProps = {
  event: EventType,
  zIndex: number,
  handleClick: HandleClickType,
  color: string,
}

export default function Event(props: EventProps) {
  const { event, zIndex, handleClick, color } = props;
  const theme = useTheme();
  
  const eventStartTime = (startTime: string) => {
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

  const background = theme.palette.augmentColor({
    color: {
      main: color,
    },
  });

  const small = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Paper 
      sx={{
        backgroundColor: color,
        maxHeight: '800px',
        height: `${calculateHeight(event.start_time, event.end_time)}px`,
        transform: `translateY(${eventStartTime(event.start_time)}px) translateX(80px)`,
        padding: '16px 0px 16px 16px',
        maxWidth: small ? 'calc(100vw - 112px)' : 'calc(100vw - 126px)',
        width: '100%',
        mr: '8px',
        position: 'absolute',
        zIndex: `${zIndex}`,
        border: '1px solid black'
      }}
      data-testid="test_event"
      onClick={(e) => handleClick(e, event)}
    >
      <Typography
        style={{
          color: theme.palette.getContrastText(background.main),
        }}
      >
        {event.title}
        <br />
        {event.location}
      </Typography>
    </Paper>
  )
};
