import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import ReminderNotification from './ReminderNotification';
import { useAppSelector, useAppDispatch } from '../../hooks';
import type { Event } from '../../globalTypes'
import type { FormattedReminder } from '../../slices/reminderSlice'
import { openReminderNotification, closeReminderNotification, getTodaysReminders } from '../../slices/reminderSlice'

let displayed: any[] = [];

type ReminderQueueProps = {
  events: Event[]
}

type SnackbarKey = string | number;

type CloseReminder = {
  minutes: string,
  event_id: number
}

export default function RemindersQueue(props: ReminderQueueProps) {
  const { events } = props;
  const dispatch = useAppDispatch();
  const { todays_reminders } = useAppSelector((state) => state.reminder);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: number) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
      displayed = [...displayed.filter(key => id !== key)];
  };

  const handleClose = useCallback((payload: CloseReminder, id: SnackbarKey) => {
    dispatch(closeReminderNotification(payload))
    removeDisplayed(id)
  }, [dispatch]);

  const checkTime = useCallback((events: Event[], reminders: FormattedReminder[]) => {
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

    // https://github.com/iamhosseindhv/notistack/tree/master/examples/redux-example
    if(todays_reminders.length > 0) {
      todays_reminders.forEach(({...reminder}) => {
        const key = reminder.notification_id
        const event = events.filter((event) => event.event_id === reminder.event_id)[0]
  
        if(reminder.dismissed) {
          closeSnackbar(key);
          return;
        };
  
        if (displayed.includes(key)) return;
  
        if(reminder.open) {
          enqueueSnackbar(`${event.title} is starting in ${reminder.minutes} minutes`, {
            key,
            content: (key, message) => (
              <ReminderNotification
                key={key}
                message={message as string}
                onClose={() => handleClose({minutes: reminder.minutes, event_id: reminder.event_id}, key)}
                description={event.description!}
                location={event.location!}
                phone={event.phone!}
              />
            ),
            onExited: (event, myKey) => {
              dispatch(closeReminderNotification({minutes: reminder.minutes, event_id: reminder.event_id}));
              removeDisplayed(myKey);
            },
          })
        }
  
        storeDisplayed(key!);
      })
    }

    return () => {
      clearTimeout(interval);
    };
  },[checkTime, events, todays_reminders, closeSnackbar, enqueueSnackbar, dispatch, handleClose])

  return (
    <Stack>
      {/* need to figure this out */}
    </Stack>
  )
};
