import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import '../App.css';

export default function Day(props) {
  const { events } = props;
  console.log('events',events)
  return(
    <TableContainer component={Paper} className="App-header">
      <Table className="App-header">
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.event_id}>
              <TableCell sx={{borderRight: 'solid'}}>
                <Typography color="white">
                  date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white">
                  {event.title}&nbsp;&nbsp;&nbsp;&nbsp;
                  {event.description}&nbsp;&nbsp;&nbsp;&nbsp;
                  {event.location}&nbsp;&nbsp;&nbsp;&nbsp;
                  {event.date}&nbsp;&nbsp;&nbsp;&nbsp;
                  {event.start_time}&nbsp;&nbsp;&nbsp;&nbsp;
                  {event.end_time}&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
