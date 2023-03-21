 import * as React from 'react'
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
/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

export default function Day(props) {
  const { events } = props;
  // console.log(events)

  /**
   * 
   * @param {string} startTime 
   * @returns {number}
   */
  const eventStartTime = (startTime) => { // this works but dates are getting messed up in the db, seems to be adding 5 hours
    let pixels = -800;
    let time = 'AM';
    let hour = new Date(startTime.slice(0, startTime.length - 1)).getHours();
    let minutes = new Date(startTime.slice(0, startTime.length - 1)).getMinutes() / 15 * 20;
    if(hour > 12) {
      hour -= 12;
      time = 'PM'
    }
    time === 'AM' ? pixels += ((hour - 8) * 80 + minutes) : pixels += (320 + (hour * 80) + minutes);
    return pixels;
  };

  const eventContainerStyle = { // this needs work, probably needs to be its own component
    position: 'absolute',
    transform: `translateY(${eventStartTime(events[0].start_time)}px) translateX(96px)`, // -800 is the start, -80 is 5PM
    maxWidth: 'calc(100vw - 144px)',
    width: '100vw',
    paddingRight: '16px',
    marginRight: '-16px',
  };
  const times = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];

  return(
    <React.Fragment>
      <TableContainer component={Paper} className="App-header" sx={{width: '100%', borderRadius: 'unset', boxShadow: 'unset'}}>
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
      <div css={eventContainerStyle}>
        <Event event={events[0]} />
      </div>
    </React.Fragment>
  );
};
