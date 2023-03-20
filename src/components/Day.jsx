import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import '../App.css';

export default function Day(props) {
  const { events } = props;
  // console.log('events',events)
  const times = ['12','1','2','3','4','5','6','7','8','9','10','11',];
  return(
    <TableContainer component={Paper} className="App-header">
      <Table className="App-header">
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
                  {times[index] + ' AM'}
                </Typography>
              </TableCell>
              <TableCell sx={{height: '100px'}}/>
            </TableRow>
          ))}
          {times.map((time, index) => (
            <TableRow key={time}>
              <TableCell align="center" sx={{borderRight: 'solid', width: '5rem'}}>
                <Typography color="white">
                  {times[index] + ' PM'}
                </Typography>
              </TableCell>
              <TableCell sx={{height: '100px'}}/>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
