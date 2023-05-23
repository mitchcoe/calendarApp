import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import type { EventType } from '../../globalTypes';
import { setValidState } from '../../slices/formSlice';
import dayjs, { Dayjs } from 'dayjs';
import { MobileTimePicker } from '@mui/x-date-pickers';
import {
  Tooltip,
} from '@mui/material';
import type { TimeView } from '@mui/x-date-pickers';

const hourMinuteFormat = (position: Date | Dayjs) => {
  let hour,
      minute;
  if('hour' in position) {
    hour = position.hour();
    minute = position.minute()
  } else {
    hour = position.getHours();
    minute = position.getMinutes()
  }
  return parseInt(`${hour}${minute === 0 ? '00' : (minute < 10 ? `0${minute}` : minute)}`)
};

const eightAM = dayjs().set('hour', 8).startOf('hour');
const sixPM = dayjs().set('hour', 18).startOf('hour');
const fivePM = dayjs().set('hour', 17).startOf('hour');

type CustomTimePickerProps = {
  events: EventType[],
  timeType: 'start_time' | 'end_time',
  timeTypeValueState: string | Dayjs,
  timeTypeValueRedux: string,
  onChangeFunc: (event: Dayjs | null) => void,
}

export default function CustomTimePicker(props: CustomTimePickerProps) {
  const [error, setError] = useState<string | null>(null);
  const editingEnabled = useAppSelector((state) => state.form.editing);
  const {date, start_time, end_time, anchorType, event_id } = useAppSelector((state) => state.form);
  const {
    events,
    timeType,
    timeTypeValueState,
    timeTypeValueRedux,
    onChangeFunc,
  } = props;

  const dispatch = useAppDispatch();

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'maxDate':
      case 'minDate': {
        return 'Please select a date in the first quarter of 2022';
      }
      case 'invalidDate': {
        return 'Your date is not valid';
      }
      case 'minTime': {
        return 'Please select a time between 8AM and 6PM'
      }
      case 'maxTime': {
        return 'Please select a time between 8AM and 6PM'
      }
      case 'shouldDisableTime-hours': {
        return 'This time range is invalid or blocked by other events, please select another time'
      }
      case 'shouldDisableTime-minutes': {
        return 'Please select a time at the top or the middle of the hour'
      }
      case null: {
        return ''
      }
      default: {
        console.log(error)
        return '';
      }
    }
  }, [error]);

  const handleError = (err: string | null) => {
    if(err === null) {
      dispatch(setValidState(true));
      setError(null);
    } else {
      dispatch(setValidState(false));
      setError(err);
    }
  };

  const formattedLabel = (label: string) => {
    return label.split('_')
      .map((item) => item = item.charAt(0).toUpperCase() + item.slice(1))
      .join(' ');
  };

  let blockedTimes = events.map((event) => {
    let start = new Date(event.start_time);
    let end = new Date(event.end_time);
    let block = {
      start: hourMinuteFormat(start),
      end: hourMinuteFormat(end),
      event_id: event.event_id
    }
    return block
  });

  if(blockedTimes.length > 0 && event_id) {
    blockedTimes = blockedTimes.filter((time) => time.event_id !== event_id);
  }

  const shouldDisableTimesFunc = (value: dayjs.Dayjs, view: TimeView) => {
    if(anchorType === 'Update' && !editingEnabled) return false;
      let formattedValue = hourMinuteFormat(value);

      if(view === 'hours') {
        return blockedTimes.some((time) => {
        if(editingEnabled && formattedValue >= time.start && formattedValue <= time.end && time.event_id === event_id) {
          return false;
        } 
        if(timeType === 'start_time' && time.event_id !== event_id) {
          let end = hourMinuteFormat(dayjs(end_time));
          if(formattedValue > end) return true;
          let blocked = blockedTimes.filter((time) => {
            return time.end > formattedValue && time.end < end;
          })
          return blocked.length >= 1;
        }
        if(timeType === 'end_time' && time.event_id !== event_id) {
          let start = hourMinuteFormat(dayjs(start_time));
          if(formattedValue < start) return true;
          let blocked = blockedTimes.filter((time) => {
            return time.start < formattedValue && time.start >= start;
          })
          return blocked.length >= 1 ;
        }
        return formattedValue > time.start && formattedValue < time.end;
      });}
      if(view === 'minutes') {
        return value.minute() !== 0 && value.minute() !== 30;
      }
      return false;
  }

  return (
    <Tooltip
      disableFocusListener
      disableTouchListener
      disableHoverListener={!!date}
      title="Select a valid date first"
    >
      <div css={{display: 'inline-flex', width: '100%'}}>
        <MobileTimePicker
          data-testid={"timepicker"}
          // @ts-ignore
          controlled
          id={timeType}
          label={formattedLabel(timeType)}
          sx={{width: '100%', mb: '16px'}}
          disabled={ (anchorType === 'Create' ? false : !editingEnabled) || !date }
          minTime={eightAM}
          maxTime={ timeType === 'start_time' ? fivePM : sixPM }
          shouldDisableTime={shouldDisableTimesFunc}
          value={timeTypeValueState as Dayjs || (timeTypeValueRedux && dayjs(timeTypeValueRedux)) || undefined}
          onChange={onChangeFunc}
          onError={(newError) => handleError(newError)}
          slotProps={{
            textField: {
              helperText: errorMessage,
            },
          }}
        />
      </div>
    </Tooltip>
  );
};
