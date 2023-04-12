import * as React from 'react';
import { useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import ReminderNotification from './ReminderNotification';
import { useSelector, useDispatch } from 'react-redux'
import { openReminderNotification, closeReminderNotification, getTodaysReminders } from '../../slices/reminderSlice'

export default function RemindersQueue(props) {
  const { events } = props
  const dispatch = useDispatch();
  const { todays_reminders } = useSelector((state) => state.reminder);

  const handleClose = (payload) => {
    dispatch(closeReminderNotification(payload))
  };

  const checkTime = useCallback((events, reminders) => {
    let now = Date.now() / 1000 / 60;
    let start_times = events.filter(event => {
      let date = new Date(event.start_time)
      return date.getTime() / 1000 / 60 > now
    })
    .map(event => {
      let date = new Date(event.start_time)
      return {
        event_id: event.event_id,
        start_time: date.getTime() / 1000 / 60
      }
    })
    .sort((a, b) => a.start_time - b.start_time);

    if(start_times.length > 0) {
      start_times.forEach(event => {
        let filteredReminders = reminders.filter(reminder => reminder.event_id === event.event_id && reminder.reminders_on)
        if(filteredReminders.length > 0) {
          filteredReminders.forEach(reminder => {
            // this function is off by less than a minute, need to make it more precise
            if(Math.floor(event.start_time - now) === parseInt(reminder.minutes) && Math.floor(event.start_time) >= Math.floor(now)) {
              dispatch(openReminderNotification(reminder))
            }
          });
        }
      });
    }
  },[dispatch]);

  const getReminderData = useCallback( async () => {
    await fetch(`/reminders/today`, {
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ event_ids: events.map(event => event.event_id) }),
    })
      .then(response => response.json())
      .then(response => dispatch(getTodaysReminders(response)))
      .catch(error => console.log(error));
  }, [dispatch, events]);

  useEffect(() => {
    if(events.length > 0) {
      getReminderData()
    }
  }, [events, getReminderData])

  useEffect(() => {
    let date = new Date();
    let sec = date.getSeconds();
      
    const interval = setTimeout(() => {
      setInterval(() => checkTime(events, todays_reminders), 60000)
    }, (60 - sec) * 1000);

    return () => {
      clearTimeout(interval);
    };
  },[checkTime, events, todays_reminders])

  return (
    <Stack>
      {todays_reminders?.length > 0 ? todays_reminders.map((reminder, index) => (
        <ReminderNotification
          key={`${reminder.title}${index}`} 
          // open={index === 0 && !reminder.open ? true : false}
          open={reminder.open}
          onClose={() => handleClose({minutes: reminder.minutes, event_id: reminder.event_id})}
          title={events.filter((event) => event.event_id === reminder.event_id ).map((item) => item.title)[0]}
          minutes={reminder.minutes}
        />
      )) : null}
    </Stack>
  )
};
