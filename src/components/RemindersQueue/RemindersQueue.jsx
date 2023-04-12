import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import ReminderNotification from './ReminderNotification';
import { useSelector, useDispatch } from 'react-redux'
import { openReminderNotification, closeReminderNotification, getTodaysReminders } from '../../slices/reminderSlice'

export default function RemindersQueue(props) {
  const { events } = props
  const [time, setTime] = useState(Date.now());
  const dispatch = useDispatch();
  const { todays_reminders } = useSelector((state) => state.reminder);
  // console.log(events, todays_reminders)
  const handleClose = (payload) => {
    dispatch(closeReminderNotification(payload))
  };

  const checkTime = useCallback(async (events, reminders) => {
    let start_times = events.map(event => {
      let date = new Date(event.start_time)
      return {
        event_id: event.event_id,
        start_time: date.getTime() / 1000 / 60
      }
    });

    let now = time / 1000 / 60;
    start_times.forEach(event => {
      let filteredReminders = reminders.filter(reminder => reminder.event_id === event.event_id)
      console.log('filtered reminders', filteredReminders)
      filteredReminders.forEach(reminder => {
        console.log(event.start_time - now, 'hello', now, event.start_time);
        if(event.start_time - now <= parseInt(reminder.minutes)) {
          console.log('reminder', reminder, 'hell')
          dispatch(openReminderNotification(reminder))
        }
      })
    })
  },[dispatch, time]);

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
      .then(() => checkTime(events, todays_reminders))
      .catch(error => console.log(error));
  }, [dispatch, events]);

  useEffect(() => {
    if(events.length > 0) {
      getReminderData()
    }
  }, [events, getReminderData])

  // useEffect(() => {
  //   if(todays_reminders.length > 0) {
  //     checkTime(events, todays_reminders)
  //   }
  // },[checkTime, events])

  // useEffect(() => {
  //   const interval = setInterval(() => setTime(Date.now()), 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // },[])

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
