import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
export default function Event(props) {
  const { event } = props;
// 20px is 1/4th the cell so basically 15 minutes
// use translateY css
  return (
    <Paper sx={{
      backgroundColor: 'green',
      maxHeight: '100px',
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
