import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import '../App.css';
import Event from "./Event";

export default function Day(props) {
  const { events } = props;
  // console.log('events',events)
  const times = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];
  return(
    <TableContainer component={Paper} className="App-header" sx={{width: '100%'}}>
      <Table className="App-header" sx={{borderCollapse: 'unset'}}>
        {/* the header needs to be a date picker/display component */}
        <TableHead sx={{textAlign: 'center'}}> 
          <TableRow>
            <TableCell />
            <TableCell scope="row" align="center">
              <Typography color="white">
                Month
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {times.map((time, index) => (
            <TableRow key={time}>
              <TableCell align="center" sx={{borderRight: 'solid', width: '5rem'}}>
                <Typography color="white">
                  {times[index]}
                </Typography>
              </TableCell>
              <TableCell sx={{height: '80px', display: 'flex', width: '100%', padding: '16px'}}>
                {/* <Event event={events[0]}/> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
