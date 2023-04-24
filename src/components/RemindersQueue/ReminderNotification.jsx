import * as React from 'react';
import { useState, forwardRef, useCallback } from "react";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SnackbarContent } from "notistack";

const ReminderNotification = forwardRef((props, ref) => {
  const { onClose, message, location, phone, description } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  return(
    <SnackbarContent ref={ref} sx={{"@media (min-width:600px)": {minWidth: "344px !important"}}}>
      <Card sx={{backgroundColor: "#ff9800", width: "100%"}}>
        <CardActions
          classes={{ 
            root: {
              padding: "8px 8px 8px 16px",
              justifyContent: "space-between"
            } 
          }}
        >
          <Typography variant="subtitle2" sx={{fontWeight: "bold"}}>
            {message}
          </Typography>
          <div sx={{marginLeft: 'auto'}}>
            <IconButton
              aria-label="Show more"
              sx={{
                padding: "8px 8px",
                transform: "rotate(0deg)",
                transition: "all .2s"
              }}
              style={expanded ? { transform: "rotate(180deg)" } : null}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton
              sx={{
                padding: "8px 8px",
                transform: "rotate(0deg)",
                transition: "all .2s"
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper sx={{padding: 4}}>
            <Typography gutterBottom>
              {description}
            </Typography>
            <Typography gutterBottom>
              {location}
            </Typography>
            <Typography gutterBottom>
              {phone}
            </Typography>
            {/* add a button to take you to the day and possibly open the form */}
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  )
});

export default ReminderNotification;
